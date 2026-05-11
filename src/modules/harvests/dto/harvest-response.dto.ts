import { ApiProperty } from '@nestjs/swagger';

export class HarvestResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'Safra 2026' })
  name!: string;

  @ApiProperty({ example: 2026 })
  year!: number;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
