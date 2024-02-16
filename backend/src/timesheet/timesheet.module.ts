import { Module } from '@nestjs/common';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from './timesheet.service';
import { PrismaService } from 'src/prisma.service';
import { EmployeeModule } from 'src/employee/employee.module';
import { EmployeeService } from 'src/employee/employee.service';

@Module({
	imports : [EmployeeModule], 
    controllers: [TimesheetController],
    providers: [TimesheetService, PrismaService,EmployeeService],
})
export class TimesheetModule {}

