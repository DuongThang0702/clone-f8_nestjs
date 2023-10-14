import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type InfoCourseDocument = HydratedDocument<InfoCourse>;

@Schema({ timestamps: true })
export class InfoCourse {
  @Prop()
  name: string;

  @Prop({ type: Date })
  openingDay: Date;

  @Prop()
  area: string;

  @Prop()
  schedule: string;

  @Prop()
  duration: string;

  @Prop()
  slot: number;
}

export const InfoCourseSchema = SchemaFactory.createForClass(InfoCourse);
