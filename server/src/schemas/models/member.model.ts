import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from '..';
import { Model } from 'mongoose';
import {
  CreateMemberDto,
  CreateMemberBySocialDto,
  UpdateMemberDto,
} from './dto';

@Injectable()
export class MemberModel {
  constructor(@InjectModel(Member.name) private member: Model<Member>) {}

  findProfileById(userId: string): Promise<Member> {
    return this.member
      .findOne({ _id: userId })
      .select('-_id -password -isActived -activedAt -updatedAt -__v')
      .exec();
  }

  findAllByEmailOrPhone(email: string): Promise<Member[]> {
    return this.member.find({ email }).exec();
  }

  findOneByEmailOrPhone(email: string): Promise<Member> {
    return this.member.findOne({ email }).exec();
  }

  create(input: CreateMemberDto): Promise<Member> {
    return this.member.create(input);
  }

  updateById(input: UpdateMemberDto): Promise<any> {
    return this.member.updateOne(
      { _id: input.userId },
      { $set: { ...input } },
    );
  }

  createBySocial(input: CreateMemberBySocialDto): Promise<Member> {
    return this.member.create(input);
  }

  active(email: string, isActived: boolean = true) {
    return this.member.updateOne(
      { email: email.toLowerCase() },
      { $set: { isActived } },
    );
  }

  changeInviteMode(userId: string, isInviteAble: boolean) {
    return this.member.updateOne({ _id: userId }, { $set: { isInviteAble } });
  }

  updatePassword(userId: string, password: string) {
    return this.member.updateOne({ _id: userId }, { $set: { password } });
  }
}
