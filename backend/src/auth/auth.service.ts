/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

	constructor(private userService: UserService,
				private jwtService: JwtService){}
				
	async login(dto:  AuthDto){
		const user = await this.validateUser(dto);	
		const payload = {
			email : user.email,
			sub: {
				name: user.name,
				role: user.role,	
			}
		};
		return {
			user,
			backendTokens: {
				accessToken: await this.jwtService.signAsync(payload, {
					expiresIn: '3h',
					secret: process.env.jwtSecretKey,
				}),
				refreshToken: await this.jwtService.signAsync(payload, {
					expiresIn: '7d',
					secret: process.env.jwtRefreshTokenKey,
				})  
			},
			message : "User Authenticated successfully."
		} 
	}

	async validateUser(dto: AuthDto){
		const user = await this.userService.findbyEmail(dto.email)

		if(user && (await compare(dto.password, user.password))){
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const {password, ...result} = user;
			return result
		}
		throw new UnauthorizedException("The Email or Password are Incorrect")
	}

	async refreshToken(user: any){
		const payload = {
			email : user.email,
			sub: user.sub
		};

		return {
				accessToken: await this.jwtService.signAsync(payload, {
					expiresIn: '3h',
					secret: process.env.jwtSecretKey,
				}),
				refreshToken: await this.jwtService.signAsync(payload, {
					expiresIn: '7d',
					secret: process.env.jwtRefreshTokenKey,
				})  
		}
	}  
}
