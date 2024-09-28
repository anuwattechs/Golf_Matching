import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from 'src/schemas';
import { AuthProvidersEnum } from 'src/shared/enums';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return createdUser.save();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async remove(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: string;
    provider: AuthProvidersEnum;
  }): Promise<User | null> {
    return this.userModel.findOne({ socialId, provider }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
