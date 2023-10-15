import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lesson } from 'src/utils/schema';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>,
  ) {}
}
