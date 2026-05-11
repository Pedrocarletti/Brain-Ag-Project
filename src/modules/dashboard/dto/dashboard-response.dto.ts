import { ApiProperty } from '@nestjs/swagger';

export class FarmsByStateDto {
  @ApiProperty({ example: 'MG' })
  state!: string;

  @ApiProperty({ example: 10 })
  count!: number;
}

export class FarmsByCropDto {
  @ApiProperty({ example: 'Soja', description: 'Nome da cultura plantada.' })
  crop!: string;

  @ApiProperty({ example: 8, description: 'Quantidade de fazendas distintas com a cultura plantada.' })
  count!: number;
}

export class LandUseDto {
  @ApiProperty({ example: 5000 })
  agriculturalArea!: number;

  @ApiProperty({ example: 2000 })
  vegetationArea!: number;
}

export class DashboardResponseDto {
  @ApiProperty({ example: 15 })
  totalFarms!: number;

  @ApiProperty({ example: 7000 })
  totalHectares!: number;

  @ApiProperty({ type: [FarmsByStateDto] })
  farmsByState!: FarmsByStateDto[];

  @ApiProperty({ type: [FarmsByCropDto] })
  farmsByCrop!: FarmsByCropDto[];

  @ApiProperty({ type: LandUseDto })
  landUse!: LandUseDto;
}
