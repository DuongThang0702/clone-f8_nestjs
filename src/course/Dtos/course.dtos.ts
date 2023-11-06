import { IsNotEmpty } from 'class-validator';
import { CreateInfoDto } from './info.dtos';

export class CreateCourseDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  promise: string;
  @IsNotEmpty()
  openingDay: Date;
  @IsNotEmpty()
  area: string;
  @IsNotEmpty()
  schedule: string;
  @IsNotEmpty()
  duration: string;
  @IsNotEmpty()
  slot: number;
}

export class UpdateCourseDto {
  title: string;
  description: string;
  promise: string;

  openingDay: Date;
  area: string;
  schedule: string;
  duration: string;
  slot: number;
}
