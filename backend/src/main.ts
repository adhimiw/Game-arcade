import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import * as helmet from 'helmet'
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  // Security
  app.use(helmet())
  app.use(compression())
  app.use(cookieParser())

  // CORS
  app.enableCors({
    origin: configService.get('FRONTEND_URL') || 'http://localhost:5173',
    credentials: true,
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  // API prefix
  app.setGlobalPrefix('api')

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Game Arcade API')
    .setDescription('The Game Arcade Platform API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('games', 'Game endpoints')
    .addTag('leaderboard', 'Leaderboard endpoints')
    .addTag('socket', 'WebSocket endpoints')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = configService.get('PORT') || 3001
  await app.listen(port)

  console.log(`🚀 Game Arcade API is running on: http://localhost:${port}/api`)
  console.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`)
}

bootstrap()