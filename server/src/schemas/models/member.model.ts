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
  async findProfileById(userId: string): Promise<Member | null> {
    return this.memberModel
      .findOne({ _id: userId })
      .select('-_id -password -isActived -activedAt -updatedAt -__v')
      .exec();
  }

  async findAllBySocialId(input: FindBySocialIdDto): Promise<Member[]> {
    return this.memberModel.find(input).exec();
  }

  async findOneBySocialId(input: FindBySocialIdDto): Promise<Member | null> {
    return this.memberModel.findOne(input).exec();
  }

  async findAllByUsername(username: string): Promise<Member[]> {
    return this.memberModel.find({ username }).exec();
  }

  async findById(userId: string): Promise<Member | null> {
    return this.memberModel.findOne({ _id: userId }).exec();
  }

  async findOneByUsername(username: string): Promise<Member | null> {
    return this.memberModel.findOne({ username }).exec();
  }

  async create(input: CreateMemberDto): Promise<Member> {
    return this.memberModel.create({ ...input, isRegistered: true });
  }

  async updateById(input: UpdateMemberDto): Promise<Member | null> {
    const result = await this.memberModel.updateOne(
      { _id: input.userId },
      { $set: { ...input, isRegistered: true } },
    );
    return result.modifiedCount > 0 ? this.findById(input.userId) : null;
  }

  async createBySocial(input: CreateMemberBySocialDto): Promise<Member> {
    return this.memberModel.create(input);
  }

  async setActive(userId: string, isActive: boolean = true): Promise<void> {
    await this.memberModel.updateOne(
      { _id: userId },
      { $set: { isActived: isActive } },
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
    await this.memberModel.updateOne({ username }, { $set: { password } });
  }
}
