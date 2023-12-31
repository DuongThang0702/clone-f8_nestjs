import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Lesson, LessonDocument } from './lesson.schema';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema({ timestamps: true })
export class Chapter {
  @Prop({ length: 50 })
  title: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Lesson.name }] })
  lesson: LessonDocument[];
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
