import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { Tag } from '..';
import { CreateTagDto } from './dto';

@Injectable()
export class TagModel {
    constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>) {}

    /**
     * Find all tags
     * @returns A promise of an array of Tag documents
     */
    async findAll(): Promise<Tag[]> {
        return this.tagModel.find().exec();
    }

    /**
     * Find a tag by its ID
     * @param tagId The ID of the tag
     * @returns A promise of a Tag document
     */
    async findById(tagId: string): Promise<Tag> {
        const tag = await this.tagModel.findOne({ _id: tagId }).exec();
        if (!tag) {
            throw new HttpException('Tag not found', 404);
        }
        return tag;
    }

    /**
     * Create a new tag
     * @param input The tag creation data
     * @returns A promise of the created Tag document
     */
    async create(input: CreateTagDto): Promise<Tag> {
        const isTagExists = await this.tagModel
            .findOne({ tagName: input.tagName })
            .exec();
        if (isTagExists) {
            throw new HttpException('Tag already exists', 400);
        }
        return this.tagModel.create(input);
    }

    /**
     * Update a tag by its ID
     * @param tagId The ID of the tag
     * @param input The data to update the tag
     * @returns A promise of the update operation result
     */
    async updateById(tagId: string, input: CreateTagDto): Promise<any> {
        const tag = await this.tagModel.findOne({ _id: tagId }).exec();
        if (!tag) {
            throw new HttpException('Tag not found', 404);
        }
        return this.tagModel.updateOne({ _id: tagId }, { $set: input }).exec();
    }

    /**
     * Delete a tag by its ID
     * @param tagId The ID of the tag
     * @returns A promise of the delete operation result
     */
    async deleteById(tagId: string): Promise<any> {
        const tag = await this.tagModel.findOne({ _id: tagId }).exec();
        if (!tag) {
            throw new HttpException('Tag not found', 404);
        }
        return this.tagModel.deleteOne({ _id: tagId }).exec();
    }

    /**
     * Start a mongoose session for transactions
     * @returns A mongoose session object
     */
    startSession(): Promise<ClientSession> {
        return this.tagModel.startSession();
    }
}
