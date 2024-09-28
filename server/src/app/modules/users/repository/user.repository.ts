import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from 'src/schemas';
import { AuthProvidersEnum } from 'src/shared/enums';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Method for creating a new user
  async create(data: CreateUserDto): Promise<User> {
    const currentDate = new Date();
    const createdUser = new this.userModel({
      ...data,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    return await createdUser.save();
  }

  // Method for finding user by ID
  async findById(id: string): Promise<User | null> {
    return await this.userModel.findById(id).exec();
  }

  // Method for removing a user by ID
  async remove(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  // Method for finding user by email
  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  // Method for finding user by social ID and provider
  async findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: string;
    provider: AuthProvidersEnum;
  }): Promise<User | null> {
    return await this.userModel.findOne({
      where: { socialId, provider },
    });
  }

  // Method for finding all users
  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  // Method for updating user details by ID
  async update(id: string, data: Partial<User>): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }
}
