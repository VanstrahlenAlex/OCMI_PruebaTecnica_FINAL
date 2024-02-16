import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateUserDto) {
        try {

            if (dto.role !== 'CLIENT' && dto.role !== 'ADMIN') {
                throw new BadRequestException('Invalid user role');
            }


            if (dto.role === 'ADMIN' && !dto.email.endsWith('@peopaygo.com')) {
                throw new BadRequestException('Only ADMIN accounts with @peopaygo.com domain are allowed');
            }

            const createdUser  = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    name: dto.name,
                    password: await hash(dto.password, 10),
                    role: dto.role,
                },
            });
            return { message: 'User created successfully', createdUser };
        } catch (error) {
            if (error.code === 'P2002' || error.code === 'P2003' ) {

                throw new ConflictException('Email already exists');
            } else {

                throw error;
            }
        }
    }

	 async update(id: number, dto: UpdateUserDto) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    id: id,
                },
            });

            if (!existingUser) {
                throw new NotFoundException('User not found');
            }

            const updatedUser = await this.prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    name: dto.name,
					email: dto.email,
                    password: await hash(dto.password, 10),
                    role: dto.role,
                },
            });
            return { message: 'User updated successfully', updatedUser };
        } catch (error) {
            throw error;
        }
    }

	async findAllUsers() {
        return await this.prisma.user.findMany();
    }

    async findbyEmail(email: string){
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            }
        })
    }

    async findbyId(id: number){
        return await this.prisma.user.findUnique({
            where: {
                id: id,
            }
        })
    }
}
