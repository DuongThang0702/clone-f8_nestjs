import { IsNotEmpty } from 'class-validator';

export class CreateChapterDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  lesson: string[];
}

export class UpdateChapterDto {
  @IsNotEmpty()
  title: string;
}
