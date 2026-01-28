import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { GamesService } from './games.service'

class SubmitScoreDto {
  gameId: string
  score: number
  difficulty?: string
  time?: number
  mistakes?: number
}

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('score')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a game score' })
  async submitScore(@Body() submitScoreDto: SubmitScoreDto, @Param() params, @Query('userId') userId?: string) {
    // In real implementation, get userId from JWT token
    const scoreData = {
      userId: userId || 'demo-user-id', // Replace with req.user.id
      gameId: submitScoreDto.gameId,
      score: submitScoreDto.score,
      difficulty: submitScoreDto.difficulty,
      time: submitScoreDto.time,
      mistakes: submitScoreDto.mistakes,
      timestamp: new Date()
    }

    await this.gamesService.submitScore(scoreData)
    return { success: true, message: 'Score submitted successfully' }
  }

  @Get(':gameId/leaderboard')
  @ApiOperation({ summary: 'Get game leaderboard' })
  async getLeaderboard(
    @Param('gameId') gameId: string,
    @Query('limit') limit: number = 10,
    @Query('difficulty') difficulty?: string
  ) {
    const leaderboard = await this.gamesService.getLeaderboard(gameId, limit, difficulty)
    return { leaderboard }
  }

  @Get(':gameId/best-score')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user best score for a game' })
  async getBestScore(
    @Param('gameId') gameId: string,
    @Query('difficulty') difficulty?: string,
    @Query('userId') userId?: string
  ) {
    // In real implementation, get userId from JWT token
    const bestScore = await this.gamesService.getUserBestScore(
      userId || 'demo-user-id', 
      gameId, 
      difficulty
    )
    return { bestScore }
  }

  @Get('stats/user')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user game statistics' })
  async getUserStats(@Query('userId') userId?: string) {
    // In real implementation, get userId from JWT token
    const stats = await this.gamesService.getUserStats(userId || 'demo-user-id')
    return { stats }
  }

  @Get(':gameId/stats')
  @ApiOperation({ summary: 'Get game statistics' })
  async getGameStats(@Param('gameId') gameId: string) {
    const stats = await this.gamesService.getGameStats(gameId)
    return { stats }
  }
}