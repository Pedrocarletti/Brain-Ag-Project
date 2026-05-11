import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCropDto {
  @ApiProperty({ example: 'Soja' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name!: string;
}
