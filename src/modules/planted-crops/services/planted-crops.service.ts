import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PlantedCrop } from '@prisma/client';
import { buildPaginatedResponse, PaginatedResponse } from '../../../common/dto/paginated-response.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CropsService } from '../../crops/services/crops.service';
import { FarmsService } from '../../farms/services/farms.service';
import { HarvestsService } from '../../harvests/services/harvests.service';
import { CreatePlantedCropDto } from '../dto/create-planted-crop.dto';
import { PlantedCropsRepository } from '../repositories/planted-crops.repository';

@Injectable()
export class PlantedCropsService {
  constructor(
    private readonly repository: PlantedCropsRepository,
    private readonly farmsService: FarmsService,
    private readonly cropsService: CropsService,
    private readonly harvestsService: HarvestsService,
  ) {}

  async create(dto: CreatePlantedCropDto): Promise<PlantedCrop> {
    await Promise.all([
      this.farmsService.findOne(dto.farmId),
      this.cropsService.findOne(dto.cropId),
      this.harvestsService.findOne(dto.harvestId),
    ]);
    const duplicate = await this.repository.findDuplicate(dto.farmId, dto.cropId, dto.harvestId);
    if (duplicate) throw new ConflictException('Essa cultura já foi cadastrada para essa fazenda nessa safra.');

    return this.repository.create({
      farm: { connect: { id: dto.farmId } },
      crop: { connect: { id: dto.cropId } },
      harvest: { connect: { id: dto.harvestId } },
    });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponse<PlantedCrop>> {
    const [data, total] = await this.repository.findAll(query);
    return buildPaginatedResponse(data, total, query.page, query.limit);
  }

  async findByFarm(farmId: string): Promise<PlantedCrop[]> {
    await this.farmsService.findOne(farmId);
    return this.repository.findByFarm(farmId);
  }

  async remove(id: string): Promise<void> {
    const plantedCrop = await this.repository.findById(id);
    if (!plantedCrop) throw new NotFoundException('Cultura plantada não encontrada.');
    await this.repository.delete(id);
  }
}
