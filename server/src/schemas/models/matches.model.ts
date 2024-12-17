import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Matches, MatchPlayer } from '..';
import { CreateMatchDto, UpdateMatchDto } from './dto';
import { JwtPayloadType } from 'src/app/modules/auth/strategies/types';

@Injectable()
export class MatchesModel {
  constructor(
    @InjectModel(Matches.name) private readonly matchesModel: Model<Matches>,
    @InjectModel(MatchPlayer.name)
    private readonly matchesPlayerModel: Model<MatchPlayer>,
  ) {}

  rootMatchModel() {
    return this.matchesModel;
  }

  async create(
    input: CreateMatchDto,
    decodedUser: JwtPayloadType,
  ): Promise<Matches> {
    const tags = input.tags.split('|');
    const createdMatch = await this.matchesModel.create({
      ...input,
      tags: input.tags == '' ? [] : tags,
      datetime: new Date(input.datetime),
      createdBy: decodedUser.userId,
      discussionId: Math.random().toString(36).substring(2),
    });

    await this.matchesPlayerModel.create({
      matchId: createdMatch._id,
      playerId: decodedUser.userId,
      isHost: true,
      joinedAt: new Date(),
      caddieSelection: 'LET_HOST',
      caddieId: null,
      caddieInfo: null,
    });

    return createdMatch;
  }

  async update(input: UpdateMatchDto): Promise<Matches> {
    return await this.matchesModel
      .findOneAndUpdate({ _id: input.matchId }, input, { new: true })
      .exec();
  }

  async findById(matchId: string): Promise<Matches> {
    return await this.matchesModel.findOne({ _id: matchId }).exec();
  }

  async findAll(): Promise<Matches[]> {
    return await this.matchesModel.find().exec();
  }

  async delete(matchId: string): Promise<Matches> {
    return await this.matchesModel.findOneAndDelete({ _id: matchId }).exec();
  }

  // async getMathHistory(userId: string): Promise<Matches[]> {
  //   const playerInMatch = await this.matchesPlayerModel
  //     .find({ playerId: userId })
  //     .exec();

  //   const matchIds = playerInMatch.map((match) => match.matchId);
  //   const matches = await this.matchesModel.find({ _id: { $in: matchIds } });

  //   return matches;
  // }

  async getMathHistory(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Matches[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }> {
    const skip = (page - 1) * limit;

    // Step 1: ค้นหา matchIds จาก matchesPlayerModel
    const playerInMatch = await this.matchesPlayerModel
      .find({ playerId: userId })
      .select('matchId') // ดึงเฉพาะ matchId
      .exec();

    const matchIds = playerInMatch.map((match) => match.matchId);

    // Step 2: คำนวณจำนวนทั้งหมด
    const total = await this.matchesModel.countDocuments({
      _id: { $in: matchIds },
    });

    // Step 3: ดึงข้อมูล Matches พร้อม Pagination
    const matches = await this.matchesModel
      .find({ _id: { $in: matchIds } })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: matches,
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  }
}
