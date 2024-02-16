import { Test, TestingModule } from '@nestjs/testing';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from './timesheet.service';
import { TimesheetDto } from './dto/timesheet.dto';
import { Timesheet } from '@prisma/client';

describe('TimesheetController', () => {
	let timesheetController: TimesheetController;
	let timesheetService: TimesheetService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
		controllers: [TimesheetController],
		providers: [TimesheetService],
		}).compile();

		timesheetController = module.get<TimesheetController>(TimesheetController);
		timesheetService = module.get<TimesheetService>(TimesheetService);
	});

	it('should be defined', () => {
		expect(timesheetController).toBeDefined();
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

		jest.spyOn(timesheetService, 'createTimesheet').mockResolvedValueOnce({ message: 'Timesheet created successfully', createdTimesheet: { id: 1 } });

		const result = await timesheetController.createTimesheet(mockDto);
		expect(result).toHaveProperty('message', 'Timesheet created successfully');
		expect(result).toHaveProperty('createdTimesheet');
		});


	});
});
