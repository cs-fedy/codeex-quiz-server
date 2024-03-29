import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'
import * as Morgan from 'src/config/morgan'
import AppModule from './modules/app.module'
import validationPipeOptions from './pipes/validation-pipe-options'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.setGlobalPrefix('/api')
  app.use(Morgan.successHandler)
  app.use(Morgan.errorHandler)

  app.use(helmet())
  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions))

  await app.listen(process.env.PORT)
}

bootstrap()
