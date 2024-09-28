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

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const user = await this.usersRepository?.findByEmail(email);
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    try {
      const clonedPayload = {
        ...createUserDto,
        provider: AuthProvidersEnum?.GOOGLE,
      };
      return await this.usersRepository?.create(clonedPayload);
    } catch (error) {
      throw new Error(error);
    }
  }
}
