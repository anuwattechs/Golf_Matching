import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from '..';
import { Model } from 'mongoose';
import { CreateMemberDto, CreateMemberBySocialDto } from './dto';

@Injectable()
export class MemberModel {
  constructor(@InjectModel(Member.name) private member: Model<Member>) {}

  findAllByEmailOrPhone(email: string): Promise<Member[]> {
    return this.member.find({ email }).exec();
  }

  findOneByEmailOrPhone(email: string): Promise<Member> {
    return this.member.findOne({ email }).exec();
  }

  create(input: CreateMemberDto): Promise<Member> {
    return this.member.create(input);
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

  updatePassword(userId: string, password: string) {
    return this.member.updateOne({ _id: userId }, { $set: { password } });
  }
}
