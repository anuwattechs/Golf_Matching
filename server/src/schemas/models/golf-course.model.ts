import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GolfCourse } from '..';
import { Model } from 'mongoose';

@Injectable()
export class GolfCourseModel {
  constructor(
    @InjectModel(GolfCourse.name)
    private readonly golfCourseModel: Model<GolfCourse>,
  ) {}

  async findAll(): Promise<GolfCourse[]> {
    return this.golfCourseModel.find().exec();
  }

  async findById(golfCourseId: string): Promise<GolfCourse | null> {
    return this.golfCourseModel.findById(golfCourseId).exec();
  }

  async create(golfCourseData: Partial<GolfCourse>): Promise<GolfCourse> {
    const newGolfCourse = new this.golfCourseModel(golfCourseData);
    return newGolfCourse.save();
  }

  async updateById(
    golfCourseId: string,
    updateData: Partial<GolfCourse>,
  ): Promise<GolfCourse | null> {
    const updatedGolfCourse = await this.golfCourseModel
      .findByIdAndUpdate(
        golfCourseId,
        updateData,
        { new: true, runValidators: true }, // Return the updated document and run validation
      )
      .exec();
    return updatedGolfCourse;
  }

  async deleteById(golfCourseId: string): Promise<{ deletedCount?: number }> {
    const result = await this.golfCourseModel
      .deleteOne({ _id: golfCourseId })
      .exec();
    return { deletedCount: result.deletedCount };
  }
}
