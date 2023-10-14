import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/utils/schema/user.schema';
import { IUserService } from './interface';
import { UserDetail } from 'src/utils/types';
import { hashSomthing } from 'src/utils/helper';
import { Providers } from 'src/utils/contants';
import { Model } from 'mongoose';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(Providers.USER_REPOSITORY)
    private readonly userRepo: Model<User>,
  ) {}

  async find(): Promise<UserDocument[]> {
    return await this.userRepo.find();
  }

  async findById(_id: string): Promise<UserDocument> {
    const user = await this.userRepo.findById(_id);
    if (user) return user;
    else throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
  }

  async findOneBy(data: object): Promise<UserDocument> {
    const user = await this.userRepo.findOne({ ...data });
    if (user) return user;
    else throw new HttpException('email not found', HttpStatus.BAD_REQUEST);
  }

  async update(
    userData: UserDocument,
    refresh_token: string,
  ): Promise<UserDocument> {
    userData.refresh_token = refresh_token;
    return await this.userRepo.findByIdAndUpdate(
      { _id: userData._id },
      { refresh_token },
    );
  }

  async create(payload: UserDetail): Promise<User> {
    const existingUser = await this.userRepo.findOne({
      email: payload.email,
    });
    if (existingUser)
      throw new HttpException('user already existed', HttpStatus.BAD_REQUEST);
    const password = await hashSomthing(payload.password);
    const newUser = new this.userRepo({ ...payload, password: password });
    return newUser.save();
  }

  async delete(id: string): Promise<boolean> {
    const user: boolean = await this.userRepo.findByIdAndDelete({ id });
    return user;
  }
}
