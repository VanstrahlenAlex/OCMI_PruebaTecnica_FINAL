import { Test, TestingModule } from '@nestjs/testing';
import { TimesheetService } from './timesheet.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';
import { TimesheetDto } from './dto/timesheet.dto';
import { Employee } from '@prisma/client';

describe('TimesheetService', () => {
	let timesheetService: TimesheetService;
	let prismaService: PrismaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
		providers: [TimesheetService, PrismaService],
		}).compile();

		timesheetService = module.get<TimesheetService>(TimesheetService);
		prismaService = module.get<PrismaService>(PrismaService);
	});

	it('should be defined', () => {
		expect(timesheetService).toBeDefined();
	});

describe('createTimesheet', () => {
it('should create a timesheet', async () => {
	const mockDto: TimesheetDto = {
		date: new Date(), 
    checkDate: new Date(), 
    state: 'Complete', 
    note: 'This is a test note', 
    totalGross: 1000,
    userId: 1, 
    employees: [{ id: 1 }],
    paymentStartDate: new Date(), 
    paymentEndDate: new Date(), 
	};

	jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({ id: 1 }); 
	jest.spyOn(prismaService.employee, 'findMany').mockResolvedValueOnce([{ id: 1 }]); 

	const result = await timesheetService.createTimesheet(mockDto);

	expect(result).toHaveProperty('message', 'Timesheet created successfully');
	expect(result).toHaveProperty('createdTimesheet');
});


});

	describe('findAllTimesheets', () => {
		it('should return an array of timesheets', async () => {
		jest.spyOn(prismaService.timesheet, 'findMany').mockResolvedValueOnce([{ id: 1 }]);

		const result = await timesheetService.findAllTimesheets();

		expect(result).toEqual([{ id: 1 }]);
		});
	});


});
