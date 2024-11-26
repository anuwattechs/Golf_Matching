import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberSettings } from '..';
import { UpdateMemberSettingsDto } from './dto';

@Injectable()
export class MemberSettingsModel {
  constructor(
    @InjectModel(MemberSettings.name)
    private readonly memberSettingsModel: Model<MemberSettings>,
  ) {}

  async update(
    memberId: string,
    input: UpdateMemberSettingsDto,
  ): Promise<MemberSettings> {
    const existingSettings = await this.memberSettingsModel.findOne({
      memberId,
    });

    const updatedData = {
      ...existingSettings?.toObject(),
      preferences: {
        ...(existingSettings?.preferences || {}),
        ...input.preferences,
      },
    };

    if (existingSettings) {
      existingSettings.set(updatedData);
      return await existingSettings.save();
    }

    return await this.memberSettingsModel.create({
      memberId,
      preferences: input.preferences,
    });
  }

  async findByMemberId(memberId: string): Promise<MemberSettings> {
    return await this.memberSettingsModel.findOne({ memberId }).exec();
  }
}
