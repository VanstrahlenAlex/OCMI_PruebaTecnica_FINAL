/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString, IsNumber, IsInt, IsOptional } from 'class-validator';

export class EmployeeDto {

	@IsInt()
	id: number;

	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	paymentType: string;

	@IsOptional()
	@IsNumber()
	hoursWorked? : number;

	@IsNotEmpty()
	@IsNumber()
	paymentAmount: number;

	@IsNotEmpty()
	@IsInt()
	userId: number;
}

