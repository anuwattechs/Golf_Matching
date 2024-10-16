import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { NullableType } from 'src/shared/types';
import { UpdateProfileDto, ChangeInviteModeDto } from './dto';
import { MemberModel } from 'src/schemas/models';
// import { UtilsService } from 'src/shared/utils/utils.service';
// import { JwtService } from '@nestjs/jwt';
// import { AuthTypeEnum } from 'src/shared/enums';
import { JwtPayloadType } from 'src/app/modules/auth/strategies/types/jwt-payload.type';
// import { ConfigService } from '@nestjs/config';
// import { AllConfigType } from 'src/app/config/config.type';

@Injectable()
export class MembersService {
  constructor(
    //     private readonly utilsService: UtilsService,
    private readonly memberModel: MemberModel,
    // private readonly jwtService: JwtService,
    //     private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async updateProfile(
    input: UpdateProfileDto,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      //! Check if user registered
      const userRegistered = await this.memberModel.findById(decoded.userId);

      if (!userRegistered)
        throw new HttpException('User not registered', HttpStatus.BAD_REQUEST);

      /*const updated = */ await this.memberModel.updateById({
        ...input,
        userId: decoded.userId,
      });

      return await this.memberModel.findProfileById(decoded.userId);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          statusCode: error.status,
          message: error.message,
          data: null,
        },
        error.status,
      );
    }
  }

  async changeInviteMode(
    input: ChangeInviteModeDto,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
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

      await this.memberModel.changeInviteMode(
        decoded.userId,
        input.isInviteAble,
      );

      return null;
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          statusCode: error.status,
          message: error.message,
          data: null,
        },
        error.status,
      );
    }
  }

  async findOneProsonalInfo(
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      // return await this.memberModel.findProfileById(decoded.userId);
      const member = await this.memberModel.findProfileById(decoded.userId);

      return !member ? null : member;
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
