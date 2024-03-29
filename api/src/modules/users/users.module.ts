import { BullModule } from '@nestjs/bull'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtMiddleware } from 'src/middleware/jwt'
import { LoggedMiddleware } from 'src/middleware/logged'
import { Hash } from 'src/services/hashing'
import { Events, Mappers, Models, Queues, Repos, Services } from 'src/utils/constants'
import AccessModule from '../access/access.module'
import CacheModule from '../cache/cache.module'
import MailModule from '../mail/mail.module'
import UsersController from './users.controllers'
import UserEvents from './users.events'
import { UserConsumer } from './users.jobs'
import UserMapper from './users.mapper'
import { UserSchema } from './users.model'
import UsersRepo from './users.repository'
import UserService from './users.services'

const userQueue = BullModule.registerQueue({ name: Queues.users })
const userModel = MongooseModule.forFeature([{ schema: UserSchema, name: Models.users }])

@Module({
  controllers: [UsersController],
  imports: [userQueue, userModel, AccessModule, MailModule, CacheModule],
  providers: [
    { provide: Mappers.user, useClass: UserMapper },
    { provide: Repos.user, useClass: UsersRepo },
    { provide: Services.hash, useClass: Hash },
    { provide: Services.user, useClass: UserService },
    { provide: Queues.users, useClass: UserConsumer },
    { provide: Events.user, useClass: UserEvents },
  ],
  exports: [
    { provide: Repos.user, useClass: UsersRepo },
    { provide: Mappers.user, useClass: UserMapper },
    { provide: Services.user, useClass: UserService },
  ],
})
export default class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware, LoggedMiddleware).forRoutes(UsersController)
  }
}
