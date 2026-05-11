import { ApiProperty } from '@nestjs/swagger';

export class FarmResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  producerId!: string;

  @ApiProperty({ example: 'Fazenda Santa Clara' })
  farmName!: string;

  @ApiProperty({ example: 'Uberaba' })
  city!: string;

  @ApiProperty({ example: 'MG' })
  state!: string;

  @ApiProperty({ example: 1000 })
  totalArea!: number;

  @ApiProperty({ example: 700 })
  agriculturalArea!: number;

  @ApiProperty({ example: 200 })
  vegetationArea!: number;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
