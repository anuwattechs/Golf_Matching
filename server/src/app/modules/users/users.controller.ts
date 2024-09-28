import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { Post, Body } from '@nestjs/common';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/schemas';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('User created successfully')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
