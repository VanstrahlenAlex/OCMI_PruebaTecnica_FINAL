/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; 

@Module({
	imports: [
		JwtModule.registerAsync({
		imports: [ConfigModule], 
		useFactory: async (configService: ConfigService) => ({
			secret: configService.get<string>('jwtSecretKey'), 
			signOptions: { expiresIn: '1h' }, 
		}),
		inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, UserService, PrismaService],
})
export class AuthModule {}

