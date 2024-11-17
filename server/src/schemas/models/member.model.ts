import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '..';
import {
  CreateMemberDto,
  CreateMemberBySocialDto,
  UpdateMemberDto,
  FindBySocialIdDto,
  Stats,
  Profile,
  ProfileForSearch,
  ResultsPaginatedFriendsDto,
} from './dto';
import { ScoresModel } from './scores.model';
import { FriendStatusEnum } from 'src/shared/enums';
import { UtilsService } from 'src/shared/utils/utils.service';

@Injectable()
export class MemberModel {
  constructor(
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
    private readonly utilsService: UtilsService,
    private readonly scoresModel: ScoresModel,
  ) {}

  // Fetch profile details by user ID excluding sensitive information
  async findProfileDetailById(userId: string): Promise<unknown> {
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

  async checkUserRegistration(userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    return !!user;
  }

  async getStats(userId: string): Promise<Stats> {
    const avgScoreMinMax = await this.getAvgScoreMinMax(userId);
    const member = await this.findById(userId);
    return {
      yearStart: member?.yearStart || '',
      handicap: 25,
      avgScoreMinMax: avgScoreMinMax,
    };
  }

  async getAvgScoreMinMax(
    userId: string,
  ): Promise<{ min: number; max: number }> {
    const score = await this.scoresModel.getScoreCardByPlayerId(userId);
    const member = await this.findById(userId);

    if (!score || !member) return null;

    const min = Math.min(...score.map((s) => s.myScore));
    const max = Math.max(...score.map((s) => s.myScore));

    return {
      min: min || 0,
      max: max || 0,
    };
  }

  async findProfileById(userId: string): Promise<Profile> {
    const member = await this.findById(userId);
    if (!member) return null;

    const stats = await this.getStats(userId);

    const {
      _id: memberId,
      firstName,
      lastName,
      introduction,
      location,
      country,
      tags,
      isInviteAble,
    } = member;

    return {
      memberId: memberId,
      firstName: firstName,
      lastName: lastName,
      ranking: 'Rookie',
      introduction: introduction,
      location: location,
      country: country,
      friendsCount: 25,
      tags: tags,
      isInviteAble: isInviteAble,
      stats: stats,
    };
  }

  async findAllProfiles(): Promise<ProfileForSearch[]> {
    const members = await this.memberModel.find().exec();
    if (!members) return null;
    return members?.map((member) => {
      const {
        _id,
        firstName,
        lastName,
        location,
        country,
        tags,
        introduction,
        isInviteAble,
      } = member;
      return {
        memberId: _id,
        firstName: firstName,
        lastName: lastName,
        ranking: 'Rookie',
        introduction: introduction,
        location: location,
        country: country,
        tags: tags,
        isInviteAble: isInviteAble,
        status: null,
      };
    });
  }

  // async findAllProfilesWithPagination(
  //   page: number,
  //   limit: number,
  // ): Promise<ProfileForSearch[]> {
  //   const members = await this.memberModel
  //     .find()
  //     .skip((page - 1) * limit)
  //     .limit(limit)
  //     .exec();
  //   if (!members) return null;
  //   return members?.map((member) => {
  //     const {
  //       _id,
  //       firstName,
  //       lastName,
  //       location,
  //       country,
  //       tags,
  //       introduction,
  //       isInviteAble,
  //     } = member;
  //     return {
  //       memberId: _id,
  //       firstName: firstName,
  //       lastName: lastName,
  //       ranking: 'Rookie',
  //       introduction: introduction,
  //       location: location,
  //       country: country,
  //       tags: tags,
  //       isInviteAble: isInviteAble,
  //       status: null,
  //     };
  //   });
  // }

  async findAllProfilesWithPagination(
    memberId: string,
    page: number,
    limit: number,
    filterQuery: Record<string, unknown>,
  ): Promise<ResultsPaginatedFriendsDto> {
    // const filterQuery = {
    //   _id: { $ne: memberId },
    // };

    const {
      data,
      total,
      page: currentPage,
      limit: currentLimit,
      totalPages,
      hasNextPage,
      hasPrevPage,
    } = await this.utilsService.findAllWithPaginationAndFilter(
      this.memberModel,
      page,
      limit,
      filterQuery,
    );

    const result = data?.map((member) => {
      const {
        _id,
        firstName,
        lastName,
        location,
        country,
        tags,
        introduction,
        isInviteAble,
      } = member;
      return {
        memberId: _id,
        firstName: firstName,
        lastName: lastName,
        ranking: 'Rookie',
        introduction: introduction,
        location: location,
        country: country,
        tags: tags,
        isInviteAble: isInviteAble,
        status: null,
      };
    });

    return {
      result: result,
      pagination: {
        total: total,
        page: currentPage,
        limit: currentLimit,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
      },
    };
  }
}
