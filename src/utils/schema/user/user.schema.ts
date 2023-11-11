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

  @Prop()
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
