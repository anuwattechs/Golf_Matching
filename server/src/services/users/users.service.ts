import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  IdentityVerificationRegistration,
  IdentityVerificationForgorPassword,
} from 'src/schemas';
import {
  IdentityVerifyDto,
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  ChangeInviteModeDto,
  UpdatePersonalInfoDto,
  ConfirmOtpDto,
  ConfirmOtpResetPasswordDto,
  ResetPasswordDto,
} from './dto';
import { TServiceResponse, TJwtPayload } from 'src/types';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import configuration from 'src/config/configuration';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(IdentityVerificationRegistration.name)
    private identityVerificationRegistrationModel: Model<IdentityVerificationRegistration>,
    @InjectModel(IdentityVerificationForgorPassword.name)
    private identityVerificationForgorPasswordModel: Model<IdentityVerificationForgorPassword>,
  ) {}

  randomNumber(length: number = 6): string {
    const chars = '0123456789';
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  async createIndentityVerifyRegister(
    input: IdentityVerifyDto,
  ): Promise<TServiceResponse> {
    try {
      //! Check if user registered
      const userRegistered = await this.userModel.find({
        $or: [
          { email: input.username.toLowerCase() },
          { phone_number: input.username.toLowerCase() },
        ],
      });

      if (userRegistered.length > 0)
        return {
          status: 'error',
          statusCode: 400,
          message: 'User already registered',
          data: [],
        };

      //! Check if user exists
      const user = await this.identityVerificationRegistrationModel.findOne({
        username: input.username.toLowerCase(),
      });
      const now = new Date();

      const verifyCode = this.randomNumber();
      if (!user) {
        await this.identityVerificationRegistrationModel.create({
          username: input.username.toLowerCase(),
          type: input.type,
          verify_code: verifyCode,
        });
      } else {
        await this.identityVerificationRegistrationModel.updateOne(
          { username: input.username.toLowerCase() },
          {
            $set: {
              verify_code: verifyCode,
              is_verified: null,
              sent_count: user.sent_count + 1,
              updated_at: now,
            },
          },
        );
      }

      //! Send verification code to user (OTP via Email or Phone)

      return {
        status: 'success',
        statusCode: 201,
        message: 'Indentity verified successfully',
        data: [{ verify_code: verifyCode }],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async identityRegisterConfirm(
    input: ConfirmOtpDto,
  ): Promise<TServiceResponse> {
    try {
      //! Check if user identity verified
      const userRegistered =
        await this.identityVerificationRegistrationModel.findOne({
          username: input.username.toLowerCase(),
        });

      if (!userRegistered)
        return {
          status: 'error',
          statusCode: 400,
          message: 'User not registered',
          data: [],
        };

      if (userRegistered.verify_code !== input.verify_code)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Invalid verification code',
          data: [],
        };

      //! Check if user exists
      const now = new Date();
      await this.identityVerificationRegistrationModel.updateOne(
        {
          username: input.username.toLowerCase(),
        },
        { $set: { is_verified: true, updated_at: now } },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Indentity verified successfully',
        data: [],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async register(input: RegisterDto): Promise<TServiceResponse> {
    try {
      //! Check if user identity verified
      const userIdentityVerified =
        await this.identityVerificationRegistrationModel.findOne({
          username: input.email.toLowerCase(),
          is_verified: true,
        });

      if (!userIdentityVerified)
        return {
          status: 'error',
          statusCode: 400,
          message: 'User identity not verified',
          data: [],
        };

      //! Check if user registered
      const userRegistered = await this.userModel.find({
        $or: [
          { email: input.email.toLowerCase() },
          // { phone_number: input.username.toLowerCase() },
        ],
      });

      if (userRegistered.length > 0)
        return {
          status: 'error',
          statusCode: 400,
          message: 'User already registered',
          data: [],
        };

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const created = await this.userModel.create({
        ...input,
        email: input.email.toLowerCase(),
        password: hashedPassword,
      });

      return {
        status: 'success',
        statusCode: 201,
        message: 'User registered successfully',
        data: [created],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async updateProfile(
    input: UpdatePersonalInfoDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      //! Check if user registered
      const userRegistered = await this.userModel.findOne({
        _id: decoded.user_id,
      });

      if (!userRegistered)
        return {
          status: 'error',
          statusCode: 400,
          message: 'User not registered',
          data: [],
        };

      const updated = await this.userModel.updateOne(
        { _id: decoded.user_id },
        {
          $set: {
            ...input,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'User updated successfully',
        data: [updated],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async login(input: LoginDto): Promise<TServiceResponse> {
    try {
      //! Check if user registered
      const userRegistered = await this.userModel.findOne({
        $or: [
          { email: input.username.toLowerCase() },
          // { phone_number: input.username.toLowerCase() },
        ],
      });

      if (!userRegistered)
        return {
          status: 'error',
          statusCode: 400,
          message: 'User not registered',
          data: [],
        };

      const isMatched = await bcrypt.compare(
        input.password,
        userRegistered.password,
      );

      if (!isMatched)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Invalid password',
          data: [],
        };

      const now = new Date();
      const payload: TJwtPayload = {
        user_id: userRegistered._id,
        name: `${userRegistered.first_name} ${userRegistered.last_name}`,
        email: userRegistered.email,
        phone_number: userRegistered.phone_number,
        // role: userRegistered.role,
        // iat: now.getTime(),
        // exp: now.getTime() + 1000 * 60 * 60 * 24 * 30,
      };
      const token = jwt.sign(payload, configuration().jwtSecret, {
        expiresIn: '1000d',
      });

      await this.userModel.updateOne(
        {
          _id: userRegistered._id,
        },
        {
          $set: {
            is_actived: true,
            actived_at: now,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 200,
        message: 'User logged in successfully',
        data: [
          {
            user_id: userRegistered._id,
            token,
            first_name: userRegistered.first_name,
            last_name: userRegistered.last_name,
            email: userRegistered.email,
            phone_number: userRegistered.phone_number,
            nick_name: userRegistered.nick_name,
          },
        ],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async changePassword(
    input: ChangePasswordDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      //! Check Old password same as new password
      if (input.new_password === input.old_password)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Old password same as new password',
          data: [],
        };

      //! Check if user registered
      const userRegistered = await this.userModel.findOne({
        _id: decoded.user_id,
      });

      if (!userRegistered)
        return {
          status: 'error',
          statusCode: 400,
          message: 'User not registered',
          data: [],
        };

      const isMatched = await bcrypt.compare(
        input.old_password,
        userRegistered.password,
      );

      if (!isMatched)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Invalid password',
          data: [],
        };

      const hashedPassword = await bcrypt.hash(input.new_password, 10);

      const now = new Date();

      await this.userModel.updateOne(
        {
          _id: userRegistered._id,
        },
        {
          $set: {
            password: hashedPassword,
            updated_at: now,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Password changed successfully',
        data: [],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async changeInviteMode(
    input: ChangeInviteModeDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      // //! Check if user registered
      // const userRegistered = await this.userModel.findOne({
      //   _id: decoded.user_id,
      // });

      // if (!userRegistered)
      //   return {
      //     status: 'error',
      //     statusCode: 400,
      //     message: 'User not registered',
      //     data: [],
      //   };

      const now = new Date();
      await this.userModel.updateOne(
        {
          _id: decoded.user_id,
        },
        {
          $set: {
            is_invited: input.is_invited,
            updated_at: now,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Invite mode changed successfully',
        data: [{ is_invited: input.is_invited }],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async findOneProsonalInfo(decoded: TJwtPayload): Promise<TServiceResponse> {
    try {
      // //! Check if user registered
      // const userRegistered = await this.userModel.findOne({
      //   _id: decoded.user_id,
      // });

      // if (!userRegistered)
      //   return {
      //     status: 'error',
      //     statusCode: 400,
      //     message: 'User not registered',
      //     data: [],
      //   };

      const user = await this.userModel
        .findOne({
          _id: decoded.user_id,
        })
        .select(
          '-_id -password -is_actived -actived_at -created_at -updated_at',
        );

      return {
        status: 'success',
        statusCode: 200,
        message: 'User found successfully',
        data: [user],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async createIndentityVerifyResetPassword(
    input: IdentityVerifyDto,
  ): Promise<TServiceResponse> {
    try {
      //! Check if user registered
      const userRegistered = await this.userModel.findOne({
        $or: [
          { email: input.username.toLowerCase() },
          { phone_number: input.username.toLowerCase() },
        ],
      });

      if (!userRegistered)
        return {
          status: 'error',
          statusCode: 400,
          message: 'User not registered',
          data: [],
        };

      const verifyCode = this.randomNumber();
      const created = await this.identityVerificationForgorPasswordModel.create(
        {
          user_id: userRegistered._id,
          username: input.username.toLowerCase(),
          type: input.type,
          verify_code: verifyCode,
        },
      );

      //! Send verification code to user (OTP via Email or Phone)

      return {
        status: 'success',
        statusCode: 201,
        message: 'Indentity verified successfully',
        data: [
          {
            transaction_id: created._id,
            verify_code: verifyCode,
          },
        ],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async identityResetPasswordConfirm(
    input: ConfirmOtpResetPasswordDto,
  ): Promise<TServiceResponse> {
    try {
      //! Check if user identity verified
      const transaction =
        await this.identityVerificationForgorPasswordModel.findOne({
          _id: input.transaction_id,
        });

      if (!transaction)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Transaction not found',
          data: [],
        };

      if (transaction.verify_code !== input.verify_code)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Invalid verification code',
          data: [],
        };

      //! Check if user exists
      const now = new Date();
      await this.identityVerificationForgorPasswordModel.updateOne(
        {
          _id: input.transaction_id,
        },
        { $set: { is_verified: true, updated_at: now } },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Indentity verified successfully',
        data: [{ transaction_id: input.transaction_id }],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async resetPassword(input: ResetPasswordDto): Promise<TServiceResponse> {
    try {
      //! Check if user identity verified
      const transaction =
        await this.identityVerificationForgorPasswordModel.findOne({
          _id: input.transaction_id,
          is_verified: true,
          reseted_at: null,
        });

      if (!transaction)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Transaction not found or not verified',
          data: [],
        };

      //! Check if user exists
      const now = new Date();
      await this.identityVerificationRegistrationModel.updateOne(
        {
          _id: input.transaction_id,
        },
        { $set: { reseted_at: now, updated_at: now } },
      );

      const hashedPassword = await bcrypt.hash(input.password, 10);
      await this.userModel.updateOne(
        { _id: transaction.user_id },
        {
          $set: {
            password: hashedPassword,
            updated_at: now,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Password reseted successfully',
        data: [],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }
}
