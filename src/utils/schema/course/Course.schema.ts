import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Chapter, ChapterDocument } from './chapterCourse.schema';
import { InfoCourse, InfoCourseDocument } from './inforCourse.schema';
import { User, UserDocument } from '../user';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop({ length: 50, unique: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  view: number;

  @Prop(
    raw({
      publicId: { type: String, default: '' },
      path: { type: String, default: '' },
    }),
  )
  thumbnail: {
    publicId: string;
    path: string;
  };

  @Prop()
  promise: Array<string>;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Chapter.name }] })
  chapter: ChapterDocument[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: InfoCourse.name,
  })
  info: InfoCourseDocument;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  students: UserDocument[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
