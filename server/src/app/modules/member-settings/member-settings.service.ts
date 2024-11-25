import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MemberModel, MemberSettingsModel } from 'src/schemas/models';
import { UpdateMemberSettingsDto } from 'src/schemas/models/dto';
import { JwtPayloadType } from '../auth/strategies/types';
import { UtilsService } from 'src/shared/utils/utils.service';
import { DEFAULT_MEMBER_SETTINGS } from 'src/shared/constants';
import { MemberSettings } from 'src/schemas';

@Injectable()
export class MemberSettingsService {
  constructor(
    private readonly memberSettingsModel: MemberSettingsModel,
    private readonly utilsService: UtilsService,
    private readonly memberModel: MemberModel,
  ) {}

  async getMemberSettings(jwtPayload: JwtPayloadType) {
    const { userId } = jwtPayload;

    await this.checkUserRegistration(userId); // Check if user is registered

    try {
      const memberSettings =
        await this.memberSettingsModel.findByMemberId(userId);

      // If member settings do not exist, create new settings
      if (!memberSettings) {
        const newSettings = await this.memberSettingsModel.update(userId, {
          preferences: DEFAULT_MEMBER_SETTINGS,
        });
        return this.formatSettingsResponse(newSettings);
      }

      return this.formatSettingsResponse(memberSettings);
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateMemberSettings(memberId: string, input: UpdateMemberSettingsDto) {
    await this.checkUserRegistration(memberId); // Check if user is registered

    try {
      const updatedSettings = await this.memberSettingsModel.update(
        memberId,
        input,
      );
      return this.formatSettingsResponse(updatedSettings);
    } catch (error) {
      this.handleError({
        ...error,
        message: this.utilsService.getMessagesTypeSafe(
          'settings.UPDATE_SETTINGS_FAILED',
        ),
      });
    }
  }

  private formatSettingsResponse(settings: MemberSettings): any {
    const { _id, ...rest } = settings?.toObject();
    return rest;
  }

  private handleError(error: any): void {
    const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal server error';

    throw new HttpException(
      {
        status: false,
        statusCode,
        message,
        data: null,
      },
      statusCode,
    );
  }

  // Check if user is registered
  private async checkUserRegistration(userId: string): Promise<void> {
    const user = await this.memberModel.findById(userId);
    if (!user) {
      throw new HttpException(
        this.utilsService.getMessagesTypeSafe('members.USER_NOT_REGISTERED'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
