import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {
  User,
  UserSchema,
  IdentityVerificationRegistration,
  IdentityVerificationRegistrationSchema,
  IdentityVerificationForgorPassword,
  IdentityVerificationForgorPasswordSchema,
} from 'src/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: IdentityVerificationRegistration.name,
        schema: IdentityVerificationRegistrationSchema,
      },
      {
        name: IdentityVerificationForgorPassword.name,
        schema: IdentityVerificationForgorPasswordSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
