import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../../common/dto/pagination-meta.dto';
import { PlantedCropResponseDto } from './planted-crop-response.dto';

export class PaginatedPlantedCropResponseDto {
  @ApiProperty({ type: [PlantedCropResponseDto] })
  data!: PlantedCropResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
