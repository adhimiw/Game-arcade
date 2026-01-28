import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ example: 'gamer2024', description: 'Username' })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'SecurePass123!', description: 'User password' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email or username' })
  @IsString()
  emailOrUsername: string

  @ApiProperty({ example: 'SecurePass123!', description: 'User password' })
  @IsString()
  password: string
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refreshToken: string
}

export class UpdateProfileDto {
  @ApiProperty({ example: 'NewUsername', description: 'Updated username', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username?: string

  @ApiProperty({ example: 'newemail@example.com', description: 'Updated email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ example: 'John', description: 'Updated first name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string

  @ApiProperty({ example: 'Doe', description: 'Updated last name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string
}