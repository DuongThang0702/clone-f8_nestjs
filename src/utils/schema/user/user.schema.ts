import mongoose, { HydratedDocument } from 'mongoose';
import { UserRole } from '../../contants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InfoUser, InfoUserDocument } from './inforUser.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ length: 50 })
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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: InfoUser.name })
  info: InfoUserDocument;
}

export const UserSchema = SchemaFactory.createForClass(User);
