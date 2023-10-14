import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';

export type PromiseCourseDocument = HydratedDocument<PromiseCourse>;

@Schema({ timestamps: true })
export class PromiseCourse {
  @Prop({ length: 50 })
  text: string;
}

export const PromiseCourseSchema = SchemaFactory.createForClass(PromiseCourse);
