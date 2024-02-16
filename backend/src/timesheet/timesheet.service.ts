import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Timesheet, Employee } from '@prisma/client';
import { TimesheetDto } from './dto/timesheet.dto';
import { EmployeeDto } from 'src/employee/dto/employee.dto';


interface TimesheetWithEmployees extends Timesheet {
    employees: {
        id: number;
        name: string;
        paymentType: string;
        hoursWorked: number;
        paymentAmount: number;
        userId: number;
    }[];
}

@Injectable()
export class TimesheetService {
    constructor(private prisma: PrismaService) {}

    async createTimesheet(dto: TimesheetDto): Promise<{ message: string; createdTimesheet: Timesheet }> {
        try {
            const userExists = await this.prisma.user.findUnique({ where: { id: dto.userId } });
            if (!userExists) {
                throw new NotFoundException(`User with ID ${dto.userId} not found`);
            }

            const existingEmployees: Employee[] = await this.prisma.employee.findMany({
                where: {
                    id: {
                        in: dto.employees.map((employee) => employee.id)
                    }
                }
            });

            
            const createdTimesheet = await this.prisma.timesheet.create({
                data: {
                    date: dto.date,
                    checkDate: dto.checkDate,
                    state: dto.state,
                    note: dto.note,
                    totalGross: dto.totalGross,
                    paymentStartDate: dto.paymentStartDate,
                    paymentEndDate: dto.paymentEndDate,
                    user: {
                        connect: { id: dto.userId }
                    },
                    employees: {
                        connect: existingEmployees.map((employee) => ({ id: employee.id }))
                    }
                }
            });

            return { message: 'Timesheet created successfully', createdTimesheet };
        } catch (error) {
            console.error('Error creating timesheet:', error);
            throw new Error('Could not create timesheet');
        }
    }

    async findAllTimesheets(): Promise<Timesheet[]> {
        const timesheets = await this.prisma.timesheet.findMany({
            include: { employees: true }
        });

        return timesheets;
    }

    async findTimesheetById(id: number): Promise<Timesheet> {
        const timesheet = await this.prisma.timesheet.findUnique({
            where: { id },
            include: { employees: true }
        });
        if (!timesheet) {
            throw new NotFoundException('Timesheet not found');
        }
        return {
        ...timesheet
    	};
    }

    async updateTimesheet(id: number, dto: Partial<TimesheetDto>): Promise<Timesheet> {
        const timesheetUpdateData: Prisma.TimesheetUpdateInput = {};

        if (dto.date) timesheetUpdateData.date = dto.date;
        if (dto.checkDate) timesheetUpdateData.checkDate = dto.checkDate;
        if (dto.state) timesheetUpdateData.state = dto.state;
        if (dto.note) timesheetUpdateData.note = dto.note;
        if (dto.totalGross) timesheetUpdateData.totalGross = dto.totalGross;
        if (dto.userId) timesheetUpdateData.user = { connect: { id: dto.userId } };
		if (dto.paymentStartDate) timesheetUpdateData.paymentStartDate = dto.paymentStartDate;
		if (dto.paymentEndDate) timesheetUpdateData.paymentEndDate = dto.paymentEndDate;
		
        return this.prisma.timesheet.update({
            where: { id },
            data: timesheetUpdateData
        });
    }

    async deleteTimesheet(id: number): Promise<Timesheet> {
        try {
            return this.prisma.timesheet.delete({
                where: { id }
            });
        } catch (error) {
            throw new NotFoundException('Timesheet not found to delete');
        }
    }
}
