/* eslint-disable prettier/prettier */

import { Controller, Get, Param, UseGuards, Patch, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/user.dto';
@Controller('user')
export class UserController {

	constructor( private userService: UserService){}

	@UseGuards(JwtGuard)
	@Get(":id")
	async getUserProfile(@Param("id") id: number){
		return await this.userService.findbyId(id);
	}

	@UseGuards(JwtGuard)
    @Patch(':id') 
    async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return await this.userService.update(id, updateUserDto);
    }

	@UseGuards(JwtGuard)
    @Get()
    async getAllUsers() {
        return await this.userService.findAllUsers();
    }

}
 