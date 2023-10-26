import { IsNotEmpty } from 'class-validator';

export class CreateChapterDto {
  @IsNotEmpty()
  title: string;
}

export class UpdateChapterDto {
  @IsNotEmpty()
  title: string;
}
