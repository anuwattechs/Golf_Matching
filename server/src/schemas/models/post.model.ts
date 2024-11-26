import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { Post } from '..';
import { CreatePostDto } from './dto/post.dto';

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

  deleteById(id: string): Promise<DeleteResult> {
    return this.post.deleteOne({ _id: id });
  }
}
