import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { PaginatedProducerResponseDto } from '../dto/paginated-producer-response.dto';
import { ProducerResponseDto } from '../dto/producer-response.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { ProducersService } from '../services/producers.service';

@ApiTags('Producers')
@Controller('producers')
export class ProducersController {
  constructor(private readonly service: ProducersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar produtor rural' })
  @ApiCreatedResponse({ description: 'Produtor criado.', type: ProducerResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  create(@Body() dto: CreateProducerDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtores rurais' })
  @ApiOkResponse({ description: 'Lista paginada de produtores.', type: PaginatedProducerResponseDto })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produtor por id' })
  @ApiOkResponse({ type: ProducerResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produtor rural' })
  @ApiOkResponse({ type: ProducerResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateProducerDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir produtor rural' })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
