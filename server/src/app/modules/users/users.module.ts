import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from 'src/schemas';
import { UsersService } from './users.service';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User?.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
