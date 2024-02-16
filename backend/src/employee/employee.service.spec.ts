import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { PrismaService } from '../prisma.service';
import { EmployeeDto } from './dto/employee.dto';
import { Employee } from '@prisma/client';
import { ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';

describe('EmployeeService', () => {
	let employeeService: EmployeeService;
	let prismaService: PrismaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
		providers: [EmployeeService, PrismaService],
		}).compile();

		employeeService = module.get<EmployeeService>(EmployeeService);
		prismaService = module.get<PrismaService>(PrismaService);
	});

	it('should be defined', () => {
		expect(employeeService).toBeDefined();
	});

	describe('createEmployee', () => {
		it('should create an employee', async () => {
		const mockDto: EmployeeDto = {
			id: 1,
			name: 'John Doe',
			paymentType: 'Hourly',
			hoursWorked: 40,
			paymentAmount: 15.5,
			userId: 1,
		};

		jest.spyOn(prismaService.employee, 'create').mockResolvedValueOnce({ id: 1, ...mockDto });

		const result = await employeeService.createEmployee(mockDto);

		expect(result).toHaveProperty('message', 'Employee created successfully');
		expect(result).toHaveProperty('createdEmployee');
		});


	});

	describe('findAllEmployees', () => {
		const mockEmployee1: Employee = {
			id: 1,
			name: 'John Doe',
			paymentType: 'Hourly',
			hoursWorked: 40,
			paymentAmount: 15.5,
			userId: 1,
		};

		const mockEmployee2: Employee = {
			id: 2,
			name: 'Jane Smith',
			paymentType: 'Monthly',
			hoursWorked: null,
			paymentAmount: 3000,
			userId: 2,
		};
		it('should return an array of employees', async () => {
		const mockEmployees: Employee[] = [
			    mockEmployee1,
    			mockEmployee2,
		];

		jest.spyOn(prismaService.employee, 'findMany').mockResolvedValueOnce(mockEmployees);

		const result = await employeeService.findAllEmployees();

		expect(result).toEqual(mockEmployees);
		});
	});

});
