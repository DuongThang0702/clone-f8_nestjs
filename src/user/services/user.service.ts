import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/utils/schema/';
import { IUserService } from '../interface';
import { TQueryGetAll, UserDetail } from 'src/utils/types';
import { hashSomthing } from 'src/utils/helper';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async find(req: TQueryGetAll): Promise<{
    counts: number;
    users: UserDocument[];
  }> {
    const queryCommand = this.userModel.find({});

    //Sorting
    if (req?.sort) {
      const sortBy = req.sort.split(',').join(' ');
      queryCommand.sort(sortBy);
    }

    const page = parseInt(req.page) || 1;
    const limit = parseInt(req.limit) || parseInt(process.env.LIMIT);
    const skip = (page - 1) * limit;
    queryCommand.limit(limit).skip(skip);

    return queryCommand
      .exec()
      .then(async (rs) => {
        const counts = await this.userModel.find().countDocuments();
        return {
          counts: counts,
          users: rs,
        };
      })
      .catch((err) => {
        throw new Error(err);
      });
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

  async update(userData: UserDocument, newdata: object): Promise<UserDocument> {
    const response = await this.userModel.findByIdAndUpdate(
      { _id: userData._id },
      { ...newdata },
    );
    if (response === null)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    else return response;
  }

  async create(payload: UserDetail): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({
      email: payload.email,
    });
    if (existingUser)
      throw new HttpException('user already existed', HttpStatus.BAD_REQUEST);
    const password = await hashSomthing(payload.password);
    const newUser = new this.userModel({ ...payload, password: password });
    return newUser.save();
  }

  async delete(_id: string): Promise<boolean> {
    const user: boolean = await this.userModel.findByIdAndDelete({ _id });
    if (user === null)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    else return user;
  }
}
