import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateCropDto } from '../dto/create-crop.dto';
import { CropResponseDto } from '../dto/crop-response.dto';
import { PaginatedCropResponseDto } from '../dto/paginated-crop-response.dto';
import { UpdateCropDto } from '../dto/update-crop.dto';
import { CropsService } from '../services/crops.service';

@ApiTags('Crops')
@Controller('crops')
export class CropsController {
  constructor(private readonly service: CropsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar cultura' })
  @ApiCreatedResponse({ type: CropResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  create(@Body() dto: CreateCropDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar culturas' })
  @ApiOkResponse({ description: 'Lista paginada de culturas.', type: PaginatedCropResponseDto })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cultura por id' })
  @ApiOkResponse({ type: CropResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cultura' })
  @ApiOkResponse({ type: CropResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateCropDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir cultura' })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
