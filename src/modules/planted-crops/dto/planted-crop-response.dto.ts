import { ApiProperty } from '@nestjs/swagger';

export class PlantedCropResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  farmId!: string;

  @ApiProperty()
  cropId!: string;

  @ApiProperty()
  harvestId!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
