import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { EmployeeDto } from './dto/employee.dto';
import { Employee } from '@prisma/client';

describe('EmployeeController', () => {
	let employeeController: EmployeeController;
	let employeeService: EmployeeService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
		controllers: [EmployeeController],
		providers: [EmployeeService],
		}).compile();

		employeeController = module.get<EmployeeController>(EmployeeController);
		employeeService = module.get<EmployeeService>(EmployeeService);
	});

	it('should be defined', () => {
		expect(employeeController).toBeDefined();
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

		jest.spyOn(employeeService, 'createEmployee').mockResolvedValueOnce({ message: 'Employee created successfully', createdEmployee: { id: 1 } });

		const result = await employeeController.createEmployee(mockDto);

		expect(result).toHaveProperty('message', 'Employee created successfully');
		expect(result).toHaveProperty('createdEmployee');
		});


	});

	describe('findAll', () => {

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

		jest.spyOn(employeeService, 'findAllEmployees').mockResolvedValueOnce(mockEmployees);

		const result = await employeeController.findAll();

		expect(result).toEqual(mockEmployees);
		});
	});


});

