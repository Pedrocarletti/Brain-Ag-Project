import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Crop } from '@prisma/client';
import { buildPaginatedResponse, PaginatedResponse } from '../../../common/dto/paginated-response.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { normalizeText } from '../../../common/normalizers/text.normalizer';
import { CreateCropDto } from '../dto/create-crop.dto';
import { UpdateCropDto } from '../dto/update-crop.dto';
import { CropsRepository } from '../repositories/crops.repository';

@Injectable()
export class CropsService {
  constructor(private readonly repository: CropsRepository) {}

  async create(dto: CreateCropDto): Promise<Crop> {
    const name = normalizeText(dto.name);
    const existing = await this.repository.findByName(name);
    if (existing) throw new ConflictException('Cultura já cadastrada.');
    return this.repository.create({ name });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponse<Crop>> {
    const [data, total] = await this.repository.findAll(query);
    return buildPaginatedResponse(data, total, query.page, query.limit);
  }

  async findOne(id: string): Promise<Crop> {
    const crop = await this.repository.findById(id);
    if (!crop) throw new NotFoundException('Cultura não encontrada.');
    return crop;
  }

  async update(id: string, dto: UpdateCropDto): Promise<Crop> {
    await this.findOne(id);
    if (dto.name) {
      const name = normalizeText(dto.name);
      const existing = await this.repository.findByName(name);
      if (existing && existing.id !== id) throw new ConflictException('Cultura já cadastrada.');
      return this.repository.update(id, { name });
    }
    return this.repository.update(id, dto);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }
}
