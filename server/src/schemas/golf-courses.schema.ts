import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Address sub-schema
@Schema({ _id: false })
class Address {
  @Prop({ required: true })
  street1: string;

  @Prop({ default: '' })
  street2?: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  postalCode: string;
}

// Location sub-schema
@Schema({ _id: false })
class Location {
  @Prop({ type: String, enum: ['Point'], required: true })
  type: string;

  @Prop({ type: [String], required: true })
  coordinates: [string, string];
}

// Pricing sub-schema
@Schema({ _id: false })
class Pricing {
  @Prop({ required: true })
  weekdayRate: number;

  @Prop({ required: true })
  weekendRate: number;

  @Prop({ required: true })
  cartFee: number;

  @Prop({ required: true })
  caddieFee: number;
}

// Course sub-schema
@Schema({ _id: false })
class Course {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ hole: String, par: Number }], required: true })
  holes: { hole: string; par: number }[]; // Changed from pars to holes
}

@Schema({ collection: 'GolfCourses', timestamps: true, versionKey: false })
export class GolfCourse extends Document {
  @Prop({
    type: String,
    default: uuidv4, // UUID as the default value for _id
  })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Address })
  address: Address;

  @Prop({ type: Location })
  location: Location;

  @Prop({ type: [String], default: [] })
  imageGallery: string[];

  @Prop({ type: [Number], default: [] })
  availableHoles: number[];

  @Prop({ default: null })
  coverImage: string;

  pricing: {
    daytime: Pricing;
    nighttime: Pricing;
  };

  @Prop({ type: Boolean, default: false })
  isNightAvailable: boolean;

  // @Prop({ type: [Course], default: [] })
  // courses: Course[];
}

export const GolfCourseSchema = SchemaFactory.createForClass(GolfCourse);
