import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteResult, UpdateResult } from 'mongodb';
import { Post } from '..';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PostPrivacyEnum } from 'src/shared/enums';

@Injectable()
export class PostModel {
  constructor(@InjectModel(Post.name) private post: Model<Post>) {}

  findAll(): Promise<Post[]> {
    return this.post.find().exec();
  }

  findById(id: string): Promise<Post> {
    return this.post.findOne({ _id: id }).exec();
  }

  create(input: CreatePostDto): Promise<Post> {
    return this.post.create(input);
  }

  update(input: UpdatePostDto): Promise<UpdateResult> {
    const { postId, ...data } = input;
    return this.post.updateMany({ _id: postId }, { $set: data });
  }

  updatePrivacy(
    postId: string,
    privacy: PostPrivacyEnum,
  ): Promise<UpdateResult> {
    return this.post.updateOne({ _id: postId }, { $set: { privacy } });
  }

  deleteById(id: string): Promise<DeleteResult> {
    return this.post.deleteOne({ _id: id });
  }

  startSession() {
    return this.post.startSession();
  }
}
