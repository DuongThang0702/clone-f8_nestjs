import { IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  promise: Array<string>;
}

export class UpdateCourseDto {
  title: string;
  description: string;
  promise: Array<string>;
}
