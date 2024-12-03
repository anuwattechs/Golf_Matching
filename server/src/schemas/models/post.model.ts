import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { DeleteResult, UpdateResult } from 'mongodb';
import { Post } from '..';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PostPrivacyEnum } from 'src/shared/enums';

@Injectable()
export class PostModel {
  constructor(@InjectModel(Post.name) private post: Model<Post>) {}

  findAll(memberId: string): Promise<Post[]> {
    return this.post
      .find(
        { memberId },
        {},
        {
          sort: { createdAt: -1 },
          projection: {
            _id: 0,
            postId: '$_id',
            memberId: 1,
            caption: 1,
            media: 1,
            hashtags: 1, // Array of hashtags
            likes: 1, // Array of memberId
            isPinned: 1,
            pinnedAt: 1,
            privacy: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      )
      .exec();
  }

  findById(id: string): Promise<Post> {
    return this.post.findOne({ _id: id }).exec();
  }

  findAllWithPublic(memberId: string): Promise<Post[]> {
    return this.post.find({ memberId, privacy: PostPrivacyEnum.PUBLIC }).exec();
  }

  findAllWithFollow(memberId: string): Promise<Post[]> {
    return this.post
      .find({
        memberId,
        privacy: { $in: [PostPrivacyEnum.PUBLIC, PostPrivacyEnum.FOLLOWER] },
      })
      .exec();
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

  startSession(): Promise<ClientSession> {
    return this.post.startSession();
  }
}
