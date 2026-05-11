import { ApiProperty } from '@nestjs/swagger';

export class CropResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'Soja' })
  name!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
