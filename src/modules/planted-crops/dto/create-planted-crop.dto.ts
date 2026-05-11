import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePlantedCropDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  farmId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  cropId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  harvestId!: string;
}
