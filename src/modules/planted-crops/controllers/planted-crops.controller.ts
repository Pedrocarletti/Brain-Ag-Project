import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreatePlantedCropDto } from '../dto/create-planted-crop.dto';
import { PaginatedPlantedCropResponseDto } from '../dto/paginated-planted-crop-response.dto';
import { PlantedCropResponseDto } from '../dto/planted-crop-response.dto';
import { PlantedCropsService } from '../services/planted-crops.service';

@ApiTags('Planted Crops')
@Controller('planted-crops')
export class PlantedCropsController {
  constructor(private readonly service: PlantedCropsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar cultura plantada' })
  @ApiCreatedResponse({ type: PlantedCropResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  create(@Body() dto: CreatePlantedCropDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar culturas plantadas' })
  @ApiOkResponse({ description: 'Lista paginada de culturas plantadas.', type: PaginatedPlantedCropResponseDto })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query);
  }

  @Get('by-farm/:farmId')
  @ApiOperation({ summary: 'Listar culturas plantadas por fazenda' })
  @ApiOkResponse({ type: [PlantedCropResponseDto] })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  findByFarm(@Param('farmId', new ParseUUIDPipe()) farmId: string) {
    return this.service.findByFarm(farmId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir cultura plantada' })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
