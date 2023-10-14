import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/utils/schema/';
import { IUserService } from './interface';
import { UserDetail } from 'src/utils/types';
import { hashSomthing } from 'src/utils/helper';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async find(): Promise<UserDocument[]> {
    return await this.userModel.find();
  }

  async findById(_id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(_id);
    if (user) return user;
    else throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
  }

  async findOneBy(data: object): Promise<UserDocument> {
    const user = await this.userModel.findOne({ ...data });
    if (user) return user;
    else throw new HttpException('email not found', HttpStatus.BAD_REQUEST);
  }

  async update(
    userData: UserDocument,
    refresh_token: string,
  ): Promise<UserDocument> {
    userData.refresh_token = refresh_token;
    return await this.userModel.findByIdAndUpdate(
      { _id: userData._id },
      { refresh_token },
    );
  }

  async create(payload: UserDetail): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: payload.email,
    });
    if (existingUser)
      throw new HttpException('user already existed', HttpStatus.BAD_REQUEST);
    const password = await hashSomthing(payload.password);
    const newUser = new this.userModel({ ...payload, password: password });
    return newUser.save();
  }

  async delete(id: string): Promise<boolean> {
    const user: boolean = await this.userModel.findByIdAndDelete({ id });
    return user;
  }
}
