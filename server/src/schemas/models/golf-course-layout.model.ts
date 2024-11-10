import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GolfCoursesLayouts } from '..';
import { CreateGolfCourseLayoutDto } from './dto';

@Injectable()
export class GolfCourseLayoutModel {
  constructor(
    @InjectModel(GolfCoursesLayouts.name)
    private golfCourseLayoutModel: Model<GolfCoursesLayouts>,
  ) {}

  // Add a new golf course layout
  async addGolfCourseLayout(
    layoutData: CreateGolfCourseLayoutDto,
  ): Promise<GolfCoursesLayouts> {
    const newLayout = new this.golfCourseLayoutModel(layoutData);
    // return newLayout.save().then((layout) => layout.toObject());
    const layout = await newLayout.save();
    const { _id: golfCourseLayoutId, ...golfCourseLayoutRest } =
      layout.toObject();
    return {
      golfCourseLayoutId,
      ...golfCourseLayoutRest,
    } as unknown as GolfCoursesLayouts;
  }

  // Get a golf course layout by ID
  async getGolfCourseLayoutById(layoutId: string): Promise<GolfCoursesLayouts> {
    return this.golfCourseLayoutModel.findById(layoutId).exec();
  }

  // Get all layouts for a golf course
  async getLayoutsForGolfCourse(
    courseId: string,
  ): Promise<GolfCoursesLayouts[]> {
    return this.golfCourseLayoutModel.find({ courseId }).exec();
  }

  // Update golf course layout details
  async updateGolfCourseLayout(
    layoutData: Partial<GolfCoursesLayouts>,
  ): Promise<GolfCoursesLayouts> {
    return this.golfCourseLayoutModel
      .findByIdAndUpdate(layoutData, { new: true })
      .exec();
  }

  // Delete a golf course layout
  async deleteGolfCourseLayout(layoutId: string): Promise<GolfCoursesLayouts> {
    return this.golfCourseLayoutModel.findByIdAndDelete(layoutId).exec();
  }
}
