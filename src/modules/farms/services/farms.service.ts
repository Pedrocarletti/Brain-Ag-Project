import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Farm } from '@prisma/client';
import { buildPaginatedResponse, PaginatedResponse } from '../../../common/dto/paginated-response.dto';
import { normalizeState, normalizeText } from '../../../common/normalizers/text.normalizer';
import { validateFarmAreas } from '../../../common/validators/farm-area.validator';
import { ProducersService } from '../../producers/services/producers.service';
import { CreateFarmDto } from '../dto/create-farm.dto';
import { FarmsQueryDto } from '../dto/farms-query.dto';
import { UpdateFarmDto } from '../dto/update-farm.dto';
import { FarmsRepository } from '../repositories/farms.repository';

@Injectable()
export class FarmsService {
  private readonly logger = new Logger(FarmsService.name);

  constructor(
    private readonly repository: FarmsRepository,
    private readonly producersService: ProducersService,
  ) {}

  async create(dto: CreateFarmDto): Promise<Farm> {
    validateFarmAreas(dto.totalArea, dto.agriculturalArea, dto.vegetationArea);
    await this.producersService.findOne(dto.producerId);
    this.logger.log({ event: 'farm.create', producerId: dto.producerId });
    return this.repository.create({
      farmName: normalizeText(dto.farmName),
      city: normalizeText(dto.city),
      state: normalizeState(dto.state),
      totalArea: dto.totalArea,
      agriculturalArea: dto.agriculturalArea,
      vegetationArea: dto.vegetationArea,
      producer: { connect: { id: dto.producerId } },
    });
  }

  async findAll(query: FarmsQueryDto): Promise<PaginatedResponse<Farm>> {
    const [data, total] = await this.repository.findAll(query);
    return buildPaginatedResponse(data, total, query.page, query.limit);
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.repository.findById(id);
    if (!farm) throw new NotFoundException('Fazenda não encontrada.');
    return farm;
  }

  async findByProducer(producerId: string): Promise<Farm[]> {
    await this.producersService.findOne(producerId);
    return this.repository.findByProducer(producerId);
  }

  async update(id: string, dto: UpdateFarmDto): Promise<Farm> {
    const current = await this.findOne(id);
    const totalArea = dto.totalArea ?? Number(current.totalArea);
    const agriculturalArea = dto.agriculturalArea ?? Number(current.agriculturalArea);
    const vegetationArea = dto.vegetationArea ?? Number(current.vegetationArea);
    validateFarmAreas(totalArea, agriculturalArea, vegetationArea);
    if (dto.producerId) await this.producersService.findOne(dto.producerId);
    const { producerId, state, ...farmData } = dto;
    this.logger.log({ event: 'farm.update', id });
    return this.repository.update(id, {
      ...farmData,
      farmName: farmData.farmName ? normalizeText(farmData.farmName) : undefined,
      city: farmData.city ? normalizeText(farmData.city) : undefined,
      state: state ? normalizeState(state) : undefined,
      producer: producerId ? { connect: { id: producerId } } : undefined,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    this.logger.log({ event: 'farm.delete', id });
    await this.repository.delete(id);
  }
}
