import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { NullableType } from 'src/shared/types';
import { UpdateProfileDto, ChangeInviteModeDto } from './dto';
import { MemberModel } from 'src/schemas/models';
import { JwtPayloadType } from 'src/app/modules/auth/strategies/types/jwt-payload.type';
import { UtilsService } from 'src/shared/utils/utils.service';

@Injectable()
export class MembersService {
  constructor(
    private readonly memberModel: MemberModel,
    private readonly utilsService: UtilsService,
  ) {}

  async updateProfile(
    input: UpdateProfileDto,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      //! Check if user registered
      const userRegistered = await this.memberModel.findById(decoded.userId);

      if (!userRegistered)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('members.USER_NOT_REGISTERED'),
          HttpStatus.BAD_REQUEST,
        );

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

  async findOnePersonalInfo(
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
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
