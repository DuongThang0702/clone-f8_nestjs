import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Chapter, ChapterDocument } from './chapterCourse.schema';
import { PromiseCourse, PromiseCourseDocument } from './promise.schema';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop({ length: 50, unique: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  view: number;

  @Prop()
  thumbnail: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: PromiseCourse.name }],
  })
  promise: PromiseCourseDocument[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Chapter.name }] })
  chapter: ChapterDocument[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
