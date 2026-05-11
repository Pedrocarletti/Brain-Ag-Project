import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../../common/dto/pagination-meta.dto';
import { CropResponseDto } from './crop-response.dto';

export class PaginatedCropResponseDto {
  @ApiProperty({ type: [CropResponseDto] })
  data!: CropResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
