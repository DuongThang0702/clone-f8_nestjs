import { HydratedDocument } from 'mongoose';
import { UserRole } from '../contants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ length: 50 })
  email: string;

  @Prop()
  password: string;

  @Prop()
  fullname: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User);
