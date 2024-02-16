/* eslint-disable prettier/prettier */
import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; 
import { Employee } from '@prisma/client';
import { EmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeeService {
	constructor(private prisma: PrismaService) {}

	async createEmployee(dto: EmployeeDto) {
		try {
		const createdEmployee = await this.prisma.employee.create({
			data: {
				name: dto.name,
				paymentType: dto.paymentType,
				hoursWorked: dto.hoursWorked,
				paymentAmount: dto.paymentAmount,
				user: {
					connect: { id: dto.userId }
				},
			},
		});
		return { message: 'Employee created successfully', createdEmployee };
		
		} catch (error) {
		if (error.code === 'P2002' || error.code === 'P2003') {
			throw new ConflictException('Employee already exists');
		} else {
			throw error;
		}
		}
	}

	async findAllEmployees(): Promise<Employee[]> {
		return this.prisma.employee.findMany();
	}

	async findEmployeeById(id: number): Promise<Employee> {
		return this.prisma.employee.findUnique({
		where: {
			id,
		},
		});
	}

	async updateEmployee(id: number, dto: Partial<Employee>): Promise<Employee> {
		if (Object.keys(dto).length === 0) {
			throw new BadRequestException('No data provided for update');
		}
		return this.prisma.employee.update({
			where: { id },
			data: dto,
		});
	}

	async deleteEmployee(id: number): Promise<Employee> {
		try {
			return this.prisma.employee.delete({
				where: { id },
			});
			
		} catch (error) {
			throw new NotFoundException('Employee not found to remove');
		}
		
	}
}
