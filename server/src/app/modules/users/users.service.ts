import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/schemas';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthProvidersEnum } from 'src/shared/enums';
import { UserRepository } from './repository/user.repository';
import { NullableType } from 'src/shared/types/nullable.type';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { email } = createUserDto;
    const user = await this.findByEmail(email);
    console.log('user', user);
    if (user) {
      throw new HttpException(
        `User with email ${email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const clonedPayload = { ...createUserDto };
      return await this.userRepository.create(clonedPayload);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.userRepository.findByEmail(email);
  }

  findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>> {
    return this.userRepository.findBySocialIdAndProvider({
      socialId,
      provider,
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User | null> {
    const clonedPayload = { ...payload, updatedAt: new Date() };

    return await this.userRepository.update(id, clonedPayload);
  }
}
