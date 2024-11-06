import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { Gallery } from '..';
import { CreateGalleryDto } from './dto';

@Injectable()
export class GalleryModel {
  constructor(@InjectModel(Gallery.name) private gallery: Model<Gallery>) {}

  findAll(): Promise<Gallery[]> {
    return this.gallery.find().exec();
  }

  findById(id: string): Promise<Gallery> {
    return this.gallery.findOne({ _id: id }).exec();
  }

  create(input: CreateGalleryDto): Promise<Gallery> {
    return this.gallery.create(input);
  }

  deleteById(id: string): Promise<DeleteResult> {
    return this.gallery.deleteOne({ _id: id });
  }
}
