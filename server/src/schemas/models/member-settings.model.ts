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
    const settings = await this.memberSettingsModel.findOneAndUpdate(
      { memberId },
      { $set: input },
      { new: true, upsert: true }, // upsert: true creates a new document if it doesn't exist
    );

    return settings;
  }

  async findByMemberId(memberId: string): Promise<MemberSettings> {
    return await this.memberSettingsModel.findOne({ memberId }).exec();
  }
}
