import { Injectable } from '@nestjs/common';
import { PlantedCrop, Prisma } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PlantedCropsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.PlantedCropCreateInput): Promise<PlantedCrop> {
    return this.prisma.plantedCrop.create({ data, include: { farm: true, crop: true, harvest: true } });
  }

  async findAll(query: PaginationQueryDto): Promise<[PlantedCrop[], number]> {
    return Promise.all([
      this.prisma.plantedCrop.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
        include: { farm: true, crop: true, harvest: true },
      }),
      this.prisma.plantedCrop.count(),
    ]);
  }

  findByFarm(farmId: string): Promise<PlantedCrop[]> {
    return this.prisma.plantedCrop.findMany({
      where: { farmId },
      orderBy: { createdAt: 'desc' },
      include: { crop: true, harvest: true },
    });
  }

  findById(id: string): Promise<PlantedCrop | null> {
    return this.prisma.plantedCrop.findUnique({ where: { id } });
  }

  findDuplicate(farmId: string, cropId: string, harvestId: string): Promise<PlantedCrop | null> {
    return this.prisma.plantedCrop.findUnique({
      where: { farmId_cropId_harvestId: { farmId, cropId, harvestId } },
    });
  }

  delete(id: string): Promise<PlantedCrop> {
    return this.prisma.plantedCrop.delete({ where: { id } });
  }
}
