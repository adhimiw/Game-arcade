import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { AuthGuard } from '@nestjs/passport'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findById(id)
    return { user }
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Get user by username' })
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username)
    return { user }
  }

  @Get(':id/stats')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user game statistics' })
  async getUserStats(@Param('id') id: string) {
    return this.usersService.getUserStats(id)
  }

  @Get('search/:query')
  @ApiOperation({ summary: 'Search users by username or email' })
  async searchUsers(@Param('query') query: string) {
    const users = await this.usersService.searchUsers(query)
    return { users }
  }

  @Get('top/players')
  @ApiOperation({ summary: 'Get top players across all games' })
  async getTopPlayers() {
    const players = await this.usersService.getTopPlayers()
    return { players }
  }
}