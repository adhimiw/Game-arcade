import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from '../users/schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password -refreshToken')
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).select('-password -refreshToken')
  }

  async updateGameStats(userId: string, gameId: string, score: number): Promise<void> {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Update or add game stat
    const existingStatIndex = user.gameStats.findIndex(stat => stat.gameId === gameId)
    
    if (existingStatIndex !== -1) {
      // Update existing stat if new score is higher
      if (score > user.gameStats[existingStatIndex].score) {
        user.gameStats[existingStatIndex].score = score
        user.gameStats[existingStatIndex].achievedAt = new Date()
      }
    } else {
      // Add new game stat
      user.gameStats.push({
        gameId,
        score,
        achievedAt: new Date()
      })
    }

    await user.save()
  }

  async getUserStats(userId: string) {
    const user = await this.userModel.findById(userId).select('gameStats username avatar')
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return {
      username: user.username,
      avatar: user.avatar,
      gameStats: user.gameStats
    }
  }

  async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    return this.userModel
      .find({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      })
      .select('username avatar')
      .limit(limit)
  }

  async getTopPlayers(limit: number = 10): Promise<User[]> {
    return this.userModel
      .find({ isActive: true })
      .select('username avatar gameStats')
      .sort({ 'gameStats.score': -1 })
      .limit(limit)
  }
}