import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/user.dto';

describe('UserController', () => {
	let userController: UserController;
	let userService: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
		controllers: [UserController],
		providers: [UserService],
		}).compile();

		userController = module.get<UserController>(UserController);
		userService = module.get<UserService>(UserService);
	});

	describe('getUserProfile', () => {
		it('should return a user profile', async () => {
		const mockUserId = 1;
		const mockUser = { id: mockUserId, name: 'John Doe', email: 'john@example.com', password: 'password', role: 'user' };

		jest.spyOn(userService, 'findbyId').mockResolvedValue(mockUser);

		expect(await userController.getUserProfile(mockUserId)).toBe(mockUser);
		});
	});

	describe('updateUser', () => {
		it('should update a user', async () => {
		const mockUserId = 1;
		const updateUserDto: UpdateUserDto = { name: 'Jane Doe', email: 'jane@example.com', password: 'newpassword' };
		const updatedUser = {
		message: 'User updated successfully',
		updatedUser: {
			id: mockUserId,
			name: 'Jane Doe',
			email: 'jane@example.com',
			password: 'newpassword',
			role: 'user'
		}
		};

		jest.spyOn(userService, 'update').mockResolvedValue(updatedUser);

		expect(await userController.updateUser(mockUserId, updateUserDto)).toBe(updatedUser);
		});
	});

	describe('getAllUsers', () => {
		it('should return all users', async () => {
		const mockUsers = [{ id: 1, name: 'John Doe', email: 'john@example.com', password: 'password', role: 'user' }, { id: 2, name: 'Jane Doe', email: 'jane@example.com', password: 'password', role: 'user' }];

		jest.spyOn(userService, 'findAllUsers').mockResolvedValue(mockUsers);

		expect(await userController.getAllUsers()).toBe(mockUsers);
		});
	});
});
