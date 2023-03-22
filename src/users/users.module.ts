import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './shared/services/user.service';
import { HttpModule } from '@nestjs/axios';
import { AvatarSchema } from './schemas/avatar.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Avatars', schema: AvatarSchema },
      { name: 'Users', schema: UserSchema },
    ]),
    HttpModule,
    ClientsModule.registerAsync([
      {
        name: 'EVENT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const USER = configService.get('RABBITMQ_USER');
          const PASSWORD = configService.get('RABBITMQ_PASS');
          const HOST = configService.get('RABBITMQ_HOST');
          const QUEUE = configService.get('RABBITMQ_EVENT_QUEUE');

          return {
            transport: Transport.RMQ,
            options: {
              queue: QUEUE,
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
              queueOptions: {
                durable: true,
              },
            },
          };
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
