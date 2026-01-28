import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { User, UserDocument } from '../users/schemas/user.schema'
import { RegisterDto, LoginDto, RefreshTokenDto, UpdateProfileDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: User; tokens: { accessToken: string; refreshToken: string } }> {
    const { username, email, password, firstName, lastName } = registerDto

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already registered')
      }
      if (existingUser.username === username) {
        throw new ConflictException('Username already taken')
      }
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = new this.userModel({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      gameStats: []
    })

    await user.save()

    // Generate tokens
    const tokens = await this.generateTokens(user)

    return { user, tokens }
  }

  async login(loginDto: LoginDto): Promise<{ user: User; tokens: { accessToken: string; refreshToken: string } }> {
    const { emailOrUsername, password } = loginDto

    // Find user by email or username
    const user = await this.userModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate tokens
    const tokens = await this.generateTokens(user)

    return { user, tokens }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken } = refreshTokenDto

    // Find user with refresh token
    const user = await this.userModel.findOne({ refreshToken })

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    // Generate new tokens
    const tokens = await this.generateTokens(user)

    return tokens
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Check if username or email is taken by another user
    if (updateProfileDto.username && updateProfileDto.username !== user.username) {
      const existingUser = await this.userModel.findOne({
        username: updateProfileDto.username,
        _id: { $ne: userId }
      })
      if (existingUser) {
        throw new ConflictException('Username already taken')
      }
    }

    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({
        email: updateProfileDto.email,
        _id: { $ne: userId }
      })
      if (existingUser) {
        throw new ConflictException('Email already registered')
      }
    }

    // Update user
    Object.assign(user, updateProfileDto)
    await user.save()

    return user
  }

  async validateUser(emailOrUsername: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    })

    if (user && await bcrypt.compare(password, user.password)) {
      return user
    }

    return null
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password -refreshToken')
  }

  private async generateTokens(user: UserDocument): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role
    }

    // Generate access token
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })

    // Generate refresh token
    const refreshToken = uuidv4()
    user.refreshToken = refreshToken
    await user.save()

    return { accessToken, refreshToken }
  }
}