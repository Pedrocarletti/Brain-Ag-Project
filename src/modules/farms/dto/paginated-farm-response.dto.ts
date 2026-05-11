import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../../common/dto/pagination-meta.dto';
import { FarmResponseDto } from './farm-response.dto';

export class PaginatedFarmResponseDto {
  @ApiProperty({ type: [FarmResponseDto] })
  data!: FarmResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
