import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private UserModel: Model<User>,
    ) {}

    // Get all users
    async getAllUsers() {
        try {
            const users = await this.UserModel.find();
            return users;
        }catch(err) {
            throw new BadRequestException(`Error: ${err.message}`);
        }
    }

    // Change user status
    async changeUserStatus(id: string, status: 'active' | 'inactive') {
        try {
            const user = await this.UserModel.findById(id);
            if(!user) {
                throw new BadRequestException('User not found');
            }

            user.status = status;
            const savedUser = await user.save();
            return savedUser.toJSON();
        }catch(err) {
            throw new BadRequestException(`Error: ${err.message}`);
        }
    }

    // Delete user
    async deleteUser(id: string) {
        try {
            const user = await this.UserModel.findById(id);
            if(!user) {
                throw new BadRequestException('User not found');
            }

            await this.UserModel.findByIdAndDelete(id);

            return { message: 'User deleted successfully' };
        }catch(err) {
            throw new BadRequestException(`Error: ${err.message}`);
        }
    }

    // Find user by ID
    async findUserById(id: string) {
        try {
            const user = await this.UserModel.findById(id);
            if(!user) {
                throw new BadRequestException('User not found');
            }

            return user.toJSON();
        }catch(err) {
            throw new BadRequestException(`Error: ${err.message}`);
        }
    }

}
