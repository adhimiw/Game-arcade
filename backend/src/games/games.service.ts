import { Injectable } from '@nestjs/common'

interface GameScore {
  userId: string
  gameId: string
  score: number
  difficulty?: string
  time?: number
  mistakes?: number
  timestamp: Date
}

interface LeaderboardEntry {
  rank: number
  username: string
  avatar?: string
  score: number
  gameId: string
  difficulty?: string
  time?: number
  timestamp: Date
}

@Injectable()
export class GamesService {
  private scores: Map<string, GameScore[]> = new Map()

  async submitScore(scoreData: GameScore): Promise<void> {
    const { gameId } = scoreData
    const gameScores = this.scores.get(gameId) || []
    
    // Add new score
    gameScores.push(scoreData)
    
    // Sort by score (descending) and keep only top 100
    gameScores.sort((a, b) => b.score - a.score)
    if (gameScores.length > 100) {
      gameScores.splice(100)
    }
    
    this.scores.set(gameId, gameScores)
  }

  async getLeaderboard(gameId: string, limit: number = 10, difficulty?: string): Promise<LeaderboardEntry[]> {
    const gameScores = this.scores.get(gameId) || []
    
    let filteredScores = gameScores
    if (difficulty) {
      filteredScores = gameScores.filter(score => score.difficulty === difficulty)
    }
    
    // Take top scores and format
    return filteredScores
      .slice(0, limit)
      .map((score, index) => ({
        rank: index + 1,
        username: `Player${score.userId}`, // In real implementation, fetch username from database
        score: score.score,
        gameId: score.gameId,
        difficulty: score.difficulty,
        time: score.time,
        timestamp: score.timestamp
      }))
  }

  async getUserBestScore(userId: string, gameId: string, difficulty?: string): Promise<GameScore | null> {
    const gameScores = this.scores.get(gameId) || []
    const userScores = gameScores.filter(score => score.userId === userId)
    
    if (difficulty) {
      const filteredScores = userScores.filter(score => score.difficulty === difficulty)
      return filteredScores.length > 0 ? 
        filteredScores.sort((a, b) => b.score - a.score)[0] : null
    }
    
    return userScores.length > 0 ? 
      userScores.sort((a, b) => b.score - a.score)[0] : null
  }

  async getUserStats(userId: string): Promise<{ [gameId: string]: { totalGames: number; bestScore: number; averageScore: number } }> {
    const userStats: { [gameId: string]: { totalGames: number; bestScore: number; averageScore: number } } = {}
    
    for (const [gameId, scores] of this.scores.entries()) {
      const userScores = scores.filter(score => score.userId === userId)
      
      if (userScores.length > 0) {
        userStats[gameId] = {
          totalGames: userScores.length,
          bestScore: Math.max(...userScores.map(s => s.score)),
          averageScore: Math.round(userScores.reduce((sum, s) => sum + s.score, 0) / userScores.length)
        }
      }
    }
    
    return userStats
  }

  async getGameStats(gameId: string): Promise<{ totalGames: number; topScore: number; averageScore: number }> {
    const gameScores = this.scores.get(gameId) || []
    
    if (gameScores.length === 0) {
      return {
        totalGames: 0,
        topScore: 0,
        averageScore: 0
      }
    }
    
    return {
      totalGames: gameScores.length,
      topScore: Math.max(...gameScores.map(s => s.score)),
      averageScore: Math.round(gameScores.reduce((sum, s) => sum + s.score, 0) / gameScores.length)
    }
  }
}