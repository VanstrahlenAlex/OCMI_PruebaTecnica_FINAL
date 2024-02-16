import { IsNotEmpty, IsISO8601, IsArray, ArrayNotEmpty, ArrayMinSize, IsNumber, IsOptional, IsString, IsInt } from 'class-validator';
import { EmployeeDto } from '../../employee/dto/employee.dto';

export class TimesheetDto {
    @IsISO8601()
    @IsNotEmpty()
    date: Date;

    @IsISO8601()
    @IsOptional()
    checkDate?: Date;

    @IsNotEmpty()
    state: string;

    @IsOptional()
    note?: string;

    @IsNumber()
    @IsNotEmpty()
    totalGross: number;

    @IsNotEmpty()
    userId: number;

    @IsISO8601()
    @IsOptional()
    paymentStartDate?: Date;

    @IsISO8601()
    @IsOptional()
    paymentEndDate?: Date;

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    employees: EmployeeDto[];
}


