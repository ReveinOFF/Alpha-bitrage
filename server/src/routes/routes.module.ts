import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Routes, ButtonClick } from './routes.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from 'src/notifications/notifications.module';
import { User } from 'src/authentication/authentication.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Routes, ButtonClick, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string | number>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    NotificationModule,
  ],
  providers: [RoutesService],
  controllers: [RoutesController],
})
export class RoutesModule {}
