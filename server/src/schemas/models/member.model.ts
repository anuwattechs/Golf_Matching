import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult, now } from 'mongoose';
import { Member } from '..';
import {
  CreateMemberDto,
  CreateMemberBySocialDto,
  UpdateMemberDto,
  FindBySocialIdDto,
  Profile,
  // ProfileForSearch,
} from './dto';
import { omit } from 'lodash';

@Injectable()
export class MemberModel {
  constructor(
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
  ) {}

  rootMemberModel(): Model<Member> {
    return this.memberModel;
  }

  async findOne(query: Record<string, unknown>): Promise<Member | null> {
    return await this.memberModel.findOne(query).exec();
  }

  // Fetch profile details by user ID excluding sensitive information
  async findProfileDetailById(userId: string): Promise<unknown> {
    const result = await this.memberModel
      .findOne({ _id: userId })
      // .select('-_id -password -isActived -activedAt -updatedAt -__v')
      .exec()
      .then((res) => res.toObject());

    if (!result) return null;

    const selectedFields = omit(result, [
      '_id',
      'password',
      'isActived',
      'activedAt',
      'updatedAt',
      '__v',
    ]);

    return {
      ...selectedFields,
    };

    // return {
    //   firstName: result.firstName,
    //   lastName: result.lastName,
    //   nickName: result.nickName,
    //   birthDate: result.birthDate,
    //   email: result.email,
    //   phoneNo: result.phoneNo,
    //   facebookId: result.facebookId,
    //   googleId: result.googleId,
    //   appleId: result.appleId,
    //   gender: result.gender,
    //   country: result.country,
    //   location: result.location,
    //   occupation: result.occupation,
    //   tags: result.tags,
    //   yearStart: result.yearStart,
    //   avgScore: result.avgScore,
    //   favoriteCourses: result.favoriteCourses,
    //   countHoleInOne: result.countHoleInOne,
    //   bestScore: result.bestScore,
    //   clubBrands: result.clubBrands,
    //   introduction: result.introduction,
    //   profileImage: result.profileImage,
    //   isInviteAble: result.isInviteAble,
    //   isRegistered: result.isRegistered,
    // };

    // return await this.memberModel.findOne({ _id: userId }).exec();
  }

  async findAllBySocialId(input: FindBySocialIdDto): Promise<Member[]> {
    return this.memberModel.find(input).exec();
  }

  async findOneBySocialId(input: FindBySocialIdDto): Promise<Member | null> {
    return this.memberModel.findOne(input).exec();
  }

  async findOneBySocialId2(socialId: string): Promise<Member | null> {
    return this.memberModel
      .findOne({
        $or: [
          { facebookId: socialId },
          { googleId: socialId },
          { appleId: socialId },
        ],
      })
      .exec();
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
        $or: [{ email: username }, { phoneNo: username }],
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
          ...(isActive ? { activedAt: now() } : {}),
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

  updateEmailById(userId: string, email: string): Promise<UpdateWriteOpResult> {
    return this.memberModel.updateOne({ _id: userId }, { $set: { email } });
  }

  updatePhoneNoById(
    userId: string,
    phoneNo: string,
  ): Promise<UpdateWriteOpResult> {
    return this.memberModel.updateOne({ _id: userId }, { $set: { phoneNo } });
  }

  async updateProfileImage(
    userId: string,
    profileImage: string,
  ): Promise<Member | null> {
    const result = await this.memberModel.updateOne(
      { _id: userId },
      { $set: { profileImage } },
    );
    return result.modifiedCount > 0 ? this.findById(userId) : null;
  }

  updateCustomUserId(
    userId: string,
    customUserId: string,
  ): Promise<UpdateWriteOpResult> {
    return this.memberModel.updateOne(
      { _id: userId },
      { $set: { customUserId, updatedCustomUserId: now() } },
    );
  }

  async checkUserRegistration(userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    return !!user;
  }

  async findProfileById(userId: string): Promise<Profile> {
    const member = await this.findById(userId);
    if (!member) return null;

    const {
      _id: memberId,
      firstName,
      lastName,
      customUserId,
      introduction,
      tags,
      profileImage,
      nickName,
      yearStart,
    } = member;

    return {
      memberId: memberId,
      profileImage: profileImage,
      customUserId: customUserId,
      firstName: firstName,
      lastName: lastName,
      nickName: nickName,
      ranking: 'Rookie',
      introduction: introduction,
      tags: tags,
      stats: {
        yearStart: yearStart,
        handicap: 0,
        avgScore: 0,
      },
      followersCount: 0,
      followingsCount: 0,
    };
  }

  async findAllProfiles(): Promise<Member[]> {
    const members = await this.memberModel.find().exec();
    if (!members) return null;
    return members;
    // return members.map((member) => this.buildProfileForSearch(member));
  }

  async getProfilesByIds(ids: string[]): Promise<Member[]> {
    const members = await this.memberModel.find({ _id: { $in: ids } }).exec();
    if (!members) return null;
    return members;
    // return members.map((member) => this.buildProfileForSearch(member));
  }

  createFacebookId(
    userId: string,
    socialId: string,
  ): Promise<UpdateWriteOpResult> {
    return this.memberModel.updateOne(
      { _id: userId },
      { $set: { facebookId: socialId } },
    );
  }

  createAppleId(
    userId: string,
    socialId: string,
  ): Promise<UpdateWriteOpResult> {
    return this.memberModel.updateOne(
      { _id: userId },
      { $set: { appleId: socialId } },
    );
  }

  createGoogleId(
    userId: string,
    socialId: string,
  ): Promise<UpdateWriteOpResult> {
    return this.memberModel.updateOne(
      { _id: userId },
      { $set: { googleId: socialId } },
    );
  }

  removeFacebookId(userId: string): Promise<UpdateWriteOpResult> {
    return this.memberModel.updateOne(
      { _id: userId },
      { $set: { facebookId: null } },
    );
  }

  removeAppleId(userId: string): Promise<UpdateWriteOpResult> {
    return this.memberModel.updateOne(
      { _id: userId },
      { $set: { appleId: null } },
    );
  }

  removeGoogleId(userId: string): Promise<UpdateWriteOpResult> {
    return this.memberModel.updateOne(
      { _id: userId },
      { $set: { googleId: null } },
    );
  }
}
