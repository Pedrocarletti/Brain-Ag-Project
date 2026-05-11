import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateHarvestDto } from '../dto/create-harvest.dto';
import { HarvestResponseDto } from '../dto/harvest-response.dto';
import { PaginatedHarvestResponseDto } from '../dto/paginated-harvest-response.dto';
import { UpdateHarvestDto } from '../dto/update-harvest.dto';
import { HarvestsService } from '../services/harvests.service';

@ApiTags('Harvests')
@Controller('harvests')
export class HarvestsController {
  constructor(private readonly service: HarvestsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar safra' })
  @ApiCreatedResponse({ type: HarvestResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  create(@Body() dto: CreateHarvestDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar safras' })
  @ApiOkResponse({ description: 'Lista paginada de safras.', type: PaginatedHarvestResponseDto })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar safra por id' })
  @ApiOkResponse({ type: HarvestResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar safra' })
  @ApiOkResponse({ type: HarvestResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateHarvestDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir safra' })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
