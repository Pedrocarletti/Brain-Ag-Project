import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Harvest } from '@prisma/client';
import { buildPaginatedResponse, PaginatedResponse } from '../../../common/dto/paginated-response.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { normalizeText } from '../../../common/normalizers/text.normalizer';
import { CreateHarvestDto } from '../dto/create-harvest.dto';
import { UpdateHarvestDto } from '../dto/update-harvest.dto';
import { HarvestsRepository } from '../repositories/harvests.repository';

@Injectable()
export class HarvestsService {
  constructor(private readonly repository: HarvestsRepository) {}

  async create(dto: CreateHarvestDto): Promise<Harvest> {
    const name = normalizeText(dto.name);
    const [sameName, sameYear] = await Promise.all([
      this.repository.findByName(name),
      this.repository.findByYear(dto.year),
    ]);
    if (sameName || sameYear) throw new ConflictException('Safra já cadastrada.');
    return this.repository.create({ ...dto, name });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponse<Harvest>> {
    const [data, total] = await this.repository.findAll(query);
    return buildPaginatedResponse(data, total, query.page, query.limit);
  }

  async findOne(id: string): Promise<Harvest> {
    const harvest = await this.repository.findById(id);
    if (!harvest) throw new NotFoundException('Safra não encontrada.');
    return harvest;
  }

  async update(id: string, dto: UpdateHarvestDto): Promise<Harvest> {
    await this.findOne(id);
    const name = dto.name ? normalizeText(dto.name) : undefined;
    const [sameName, sameYear] = await Promise.all([
      name ? this.repository.findByName(name) : Promise.resolve(null),
      dto.year ? this.repository.findByYear(dto.year) : Promise.resolve(null),
    ]);
    if ((sameName && sameName.id !== id) || (sameYear && sameYear.id !== id)) {
      throw new ConflictException('Safra já cadastrada.');
    }
    return this.repository.update(id, { ...dto, name });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }
}
