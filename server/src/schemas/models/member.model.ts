import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '..';
import {
  CreateMemberDto,
  CreateMemberBySocialDto,
  UpdateMemberDto,
  FindBySocialIdDto,
} from './dto';

@Injectable()
export class MemberModel {
  constructor(
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
  ) {}

  // Fetch profile details by user ID excluding sensitive information
  async findProfileById(userId: string): Promise<unknown> {
    const result = await this.memberModel
      .findOne({ _id: userId })
      .select('-_id -password -isActived -activedAt -updatedAt -__v')
      .exec();

    if (!result) return null;

    return {
      firstName: result.firstName,
      lastName: result.lastName,
      nickName: result.nickName,
      birthDate: result.birthDate,
      email: result.email,
      phoneNo: result.phoneNo,
      facebookId: result.facebookId,
      googleId: result.googleId,
      appleId: result.appleId,
      gender: result.gender,
      country: result.country,
      location: result.location,
      occupation: result.occupation,
      tags: result.tags,
      yearStart: result.yearStart,
      avgScore: result.avgScore,
      favoriteCourses: result.favoriteCourses,
      countHoleInOne: result.countHoleInOne,
      bestScore: result.bestScore,
      clubBrands: result.clubBrands,
      introduction: result.introduction,
      profileImage: result.profileImage,
      isInviteAble: result.isInviteAble,
      isRegistered: result.isRegistered,
    };

    // return await this.memberModel.findOne({ _id: userId }).exec();
  }

  async findAllBySocialId(input: FindBySocialIdDto): Promise<Member[]> {
    return this.memberModel.find(input).exec();
  }

  async findOneBySocialId(input: FindBySocialIdDto): Promise<Member | null> {
    return this.memberModel.findOne(input).exec();
  }

  async findAllByUsername(username: string): Promise<Member[]> {
    return this.memberModel
      .find({
        $and: [
          {
            $or: [{ email: username }, { phoneNo: username }],
          },
          {
            facebookId: null,
            googleId: null,
            appleId: null,
          },
        ],
      })
      .exec();
  }

  async findById(userId: string): Promise<Member | null> {
    return this.memberModel.findOne({ _id: userId }).exec();
  }

  async findOneByUsername(username: string): Promise<Member | null> {
    return this.memberModel
      .findOne({
        $and: [
          {
            $or: [{ email: username }, { phoneNo: username }],
          },
          {
            facebookId: null,
            googleId: null,
            appleId: null,
          },
        ],
      })
      .exec();
  }

  async create(input: CreateMemberDto): Promise<Member> {
    return this.memberModel.create({ ...input, isRegistered: true });
  }

  async updateById(input: UpdateMemberDto): Promise<Member | null> {
    const { userId, ...data } = input;
    const result = await this.memberModel.updateOne(
      { _id: userId },
      { $set: { ...data, isRegistered: true } },
    );
    return result.modifiedCount > 0 ? this.findById(input.userId) : null;
  }

  async createBySocial(input: CreateMemberBySocialDto): Promise<Member> {
    return this.memberModel.create(input);
  }

  async setActive(userId: string, isActive: boolean = true): Promise<void> {
    await this.memberModel.updateOne(
      { _id: userId },
      {
        $set: {
          isActived: isActive,
          ...(isActive ? { activedAt: new Date() } : {}),
        },
      },
    );
  }

  async changeInviteMode(userId: string, isInviteAble: boolean): Promise<void> {
    await this.memberModel.updateOne(
      { _id: userId },
      { $set: { isInviteAble } },
    );
  }

  async updatePasswordById(userId: string, password: string): Promise<void> {
    await this.memberModel.updateOne({ _id: userId }, { $set: { password } });
  }

  async updatePasswordByUsername(
    username: string,
    password: string,
  ): Promise<void> {
    await this.memberModel.updateOne(
      {
        $or: [
          { email: username.toLowerCase() },
          { phoneNo: username.toLowerCase() },
        ],
      },
      { $set: { password } },
    );
  }
}
