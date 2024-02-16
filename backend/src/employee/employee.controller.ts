/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard'; 
import { RolesGuard } from 'src/auth/guards/roles.guard';   
import { Roles } from 'src/auth/guards/roles.decorator';   
import { EmployeeService } from './employee.service';
import { EmployeeDto } from './dto/employee.dto';
import { Employee } from '@prisma/client';

@Controller('employees')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    // @UseGuards(JwtGuard, RolesGuard) 
    // @Roles('CLIENT')
    @Post()
    async createEmployee(@Body() createEmployeeDto: EmployeeDto): Promise<{ message: string; createdEmployee: Employee }> {
        return this.employeeService.createEmployee(createEmployeeDto);
    }

    @Get()
    async findAll(): Promise<Employee[]> {
        return this.employeeService.findAllEmployees(); 
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Employee> {
        return this.employeeService.findEmployeeById(+id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateEmployeeDto: Partial<Employee>): Promise<Employee> {
        return this.employeeService.updateEmployee(+id, updateEmployeeDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Employee> {
        return this.employeeService.deleteEmployee(+id);
    } 
}

