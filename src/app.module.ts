import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { LessonService } from './lesson/lesson.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.product'],
    }),
    UserModule,
    AuthModule,
    CourseModule,
    MongooseModule.forRoot(process.env.URL_MONGOOSE),
    CloudinaryModule,
  ],
  providers: [LessonService],
})
export class AppModule {}
