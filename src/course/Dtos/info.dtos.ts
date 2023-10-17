import { IsNotEmpty } from 'class-validator';

export class CreateInfoDto {
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

export class UpdateInfoDto {
  openingDay: Date;
  area: string;
  schedule: string;
  duration: string;
  slot: number;
}
