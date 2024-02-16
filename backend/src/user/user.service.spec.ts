import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Prisma } from '@prisma/client'; 

describe('UserService', () => {
	let userService: UserService;
	let prismaService: PrismaService;

	beforeEach(() => {
		prismaService = new PrismaService();
		userService = new UserService(prismaService);
	});

	describe('create', () => {
		it('should create a new user', async () => {
		const mockUserDto: CreateUserDto = {
			email: 'test@example.com',
			name: 'Test User',
			password: 'password',
			role: 'CLIENT',
		};


		jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(mockUserDto as Prisma.User);

		const result = await userService.create(mockUserDto);

		expect(result.message).toEqual('User created successfully');
		expect(result.createdUser).toEqual(mockUserDto);
		});


	});

	describe('update', () => {
		it('should update an existing user', async () => {
		const mockUserId = 1;
		const mockUserDto: UpdateUserDto = {
			name: 'Updated User',
			email: 'updated@example.com',
			password: 'newpassword',
			role: 'CLIENT',
		};

		jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({ id: mockUserId } as Prisma.User | null);
		jest.spyOn(prismaService.user, 'update').mockResolvedValueOnce(mockUserDto as Prisma.User);

		const result = await userService.update(mockUserId, mockUserDto);

		expect(result.message).toEqual('User updated successfully');
		expect(result.updatedUser).toEqual(mockUserDto);
		});

	});


});
