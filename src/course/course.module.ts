import { Module } from '@nestjs/common';
import { CourseController } from './controllers';
import { CourseService, ChapterService, LessonService } from './services';
import { Services } from 'src/utils/contants';
import {
  Chapter,
  ChapterSchema,
  Course,
  CourseSchema,
  Lesson,
  LessonSchema,
} from 'src/utils/schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Lesson.name, schema: LessonSchema },
    ]),
  ],
  controllers: [CourseController],
  providers: [
    { provide: Services.COURSE_SERVICE, useClass: CourseService },
    { provide: Services.CHAPTER_SERVICE, useClass: ChapterService },
    { provide: Services.LESSON_SERVICE, useClass: LessonService },
  ],
})
export class CourseModule {}
