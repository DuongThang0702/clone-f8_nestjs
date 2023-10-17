import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InfoCourse, InfoCourseDocument } from 'src/utils/schema';
import { IInfoCourse } from '../interfaces/info.interface';
import { CreateInfoDto, UpdateInfoDto } from '../Dtos';

@Injectable()
export class InfoService implements IInfoCourse {
  constructor(
    @InjectModel(InfoCourse.name) private readonly infoModel: Model<InfoCourse>,
  ) {}
  async create(data: CreateInfoDto): Promise<InfoCourseDocument> {
    const info = new this.infoModel({ ...data });
    const result = await info.save();
    if (result === null)
      throw new HttpException('something went wrong!', HttpStatus.BAD_REQUEST);
    return result;
  }
  async getAll(): Promise<InfoCourseDocument[]> {
    return await this.infoModel.find();
  }
  async getOneBy(infoId: string): Promise<InfoCourseDocument> {
    const validateID = Types.ObjectId.isValid(infoId);
    if (!validateID)
      throw new HttpException('invalid info id', HttpStatus.BAD_REQUEST);
    const info = await this.infoModel.findById(infoId);
    if (info === null)
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    else return info;
  }
  async update(
    infoId: string,
    data: UpdateInfoDto,
  ): Promise<InfoCourseDocument> {
    const validateID = Types.ObjectId.isValid(infoId);
    if (!validateID)
      throw new HttpException('invalid info id', HttpStatus.BAD_REQUEST);
    const result = await this.infoModel.findByIdAndUpdate(
      infoId,
      { ...data },
      { new: true },
    );
    if (result === null)
      throw new HttpException('info not found', HttpStatus.NOT_FOUND);
    else return result;
  }
  async delete(infoId: string): Promise<boolean> {
    const validateID = Types.ObjectId.isValid(infoId);
    if (!validateID)
      throw new HttpException('invalid info id', HttpStatus.BAD_REQUEST);
    const result: boolean = await this.infoModel.findByIdAndDelete(infoId);
    if (!result)
      throw new HttpException('infoId not found', HttpStatus.NOT_FOUND);
    else return result;
  }
}
