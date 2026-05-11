import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../../common/dto/pagination-meta.dto';
import { HarvestResponseDto } from './harvest-response.dto';

export class PaginatedHarvestResponseDto {
  @ApiProperty({ type: [HarvestResponseDto] })
  data!: HarvestResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
