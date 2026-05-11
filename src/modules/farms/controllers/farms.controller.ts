import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
import { CreateFarmDto } from '../dto/create-farm.dto';
import { FarmResponseDto } from '../dto/farm-response.dto';
import { FarmsQueryDto } from '../dto/farms-query.dto';
import { PaginatedFarmResponseDto } from '../dto/paginated-farm-response.dto';
import { UpdateFarmDto } from '../dto/update-farm.dto';
import { FarmsService } from '../services/farms.service';

@ApiTags('Farms')
@Controller('farms')
export class FarmsController {
  constructor(private readonly service: FarmsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar fazenda' })
  @ApiCreatedResponse({ type: FarmResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  create(@Body() dto: CreateFarmDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar fazendas' })
  @ApiOkResponse({ description: 'Lista paginada de fazendas.', type: PaginatedFarmResponseDto })
  findAll(@Query() query: FarmsQueryDto) {
    return this.service.findAll(query);
  }

  @Get('by-producer/:producerId')
  @ApiOperation({ summary: 'Listar fazendas por produtor' })
  @ApiOkResponse({ type: [FarmResponseDto] })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  findByProducer(@Param('producerId', new ParseUUIDPipe()) producerId: string) {
    return this.service.findByProducer(producerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar fazenda por id' })
  @ApiOkResponse({ type: FarmResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar fazenda' })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiOkResponse({ type: FarmResponseDto })
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateFarmDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir fazenda' })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
