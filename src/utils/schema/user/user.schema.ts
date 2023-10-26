import { HydratedDocument } from 'mongoose';
import { UserRole } from '../../contants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ length: 50, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  is_blocked: boolean;

  @Prop({ default: '' })
  refresh_token: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  @Prop({ type: Date, default: '' })
  dateOfBirth: Date;

  @Prop({ maxlength: 10, minlength: 10, default: '' })
  phoneNumber: number;

  @Prop({ default: '' })
  sex: string;

  @Prop({ default: '' })
  studyTime: Date;

  @Prop({ default: '' })
  fullname: string;

  @Prop({ default: '' })
  graduatedFromSchool: string;

  @Prop({ default: '' })
  major: string;

  @Prop({ default: '' })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
