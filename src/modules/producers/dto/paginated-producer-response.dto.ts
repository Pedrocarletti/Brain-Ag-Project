import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../../common/dto/pagination-meta.dto';
import { ProducerResponseDto } from './producer-response.dto';

export class PaginatedProducerResponseDto {
  @ApiProperty({ type: [ProducerResponseDto] })
  data!: ProducerResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
