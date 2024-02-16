import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { TimesheetDto } from './dto/timesheet.dto';
import { Timesheet } from '@prisma/client';

@Controller('timesheets')
export class TimesheetController {
    constructor(private readonly timesheetService: TimesheetService) {}

    @Post()
    async createTimesheet(@Body() timesheetDto: TimesheetDto): Promise<{ message: string; createdTimesheet: Timesheet }> {
        return await this.timesheetService.createTimesheet(timesheetDto);
    }

    @Get()
    async getAllTimesheets(): Promise<Timesheet[]> {
        return await this.timesheetService.findAllTimesheets();
    }

    @Get(':id')
    async getTimesheetById(@Param('id') id: number): Promise<Timesheet> {
        const timesheet = await this.timesheetService.findTimesheetById(id);
        return timesheet; 
    }

    @Put(':id')
    async updateTimesheet(@Param('id') id: number, @Body() timesheetDto: Partial<TimesheetDto>): Promise<Timesheet> {
        return await this.timesheetService.updateTimesheet(id, timesheetDto);
    }

    @Delete(':id')
    async deleteTimesheet(@Param('id') id: number): Promise<Timesheet> {
        return await this.timesheetService.deleteTimesheet(id);
    }
}
