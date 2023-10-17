import { IsNotEmpty } from 'class-validator';
import { CreateInfoDto } from './info.dtos';

export class CreateChapterDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  info: CreateInfoDto;
}

export class UpdateChapterDto {
  @IsNotEmpty()
  title: string;
}
