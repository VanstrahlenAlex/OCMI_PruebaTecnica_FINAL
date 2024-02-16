/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
	@IsString()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

	@IsString()
    @IsNotEmpty({ message: 'Password should not be empty' })
    password: string;

    role: 'CLIENT' | 'ADMIN'; 
}
