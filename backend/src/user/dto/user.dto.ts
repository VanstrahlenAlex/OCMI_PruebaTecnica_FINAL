/* eslint-disable prettier/prettier */
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	email: string;

	@IsString()
	@IsOptional()
	name?: string;

	@IsString()
	password: string;

	@IsString()
	@IsOptional()
	role?: string;
}

export class UpdateUserDto {
	@IsEmail()
	email: string;

	@IsString()
	@IsOptional()
	name?: string;

	@IsString()
	password: string;

	@IsString()
	@IsOptional()
	role?: string;
}
