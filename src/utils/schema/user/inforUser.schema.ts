import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type InfoUserDocument = HydratedDocument<InfoUser>;

@Schema({ timestamps: true })
export class InfoUser {
  @Prop({ type: Date })
  dateOfBirth: Date;

  @Prop({ maxlength: 10, minlength: 10 })
  phoneNumber: number;

  @Prop()
  sex: string;

  @Prop()
  studyTime: Date;

  @Prop()
  fullname: string;

  @Prop()
  graduatedFromSchool: string;

  @Prop()
  major: string;
}

export const InfoUserSchema = SchemaFactory.createForClass(InfoUser);
