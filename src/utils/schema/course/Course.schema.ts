import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Chapter, ChapterDocument } from './chapterCourse.schema';

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
    publicId: { type: String; default: '' };
    path: { type: String; default: '' };
  };

  @Prop()
  promise: Array<string>;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Chapter.name }] })
  chapter: ChapterDocument[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
