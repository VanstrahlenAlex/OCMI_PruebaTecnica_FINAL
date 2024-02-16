/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [AuthModule],
	providers: [EmployeeService, PrismaService, JwtService],
	controllers: [EmployeeController]
})
export class EmployeeModule {}
