import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  countFarms(): Promise<number> {
    return this.prisma.farm.count();
  }

  sumAreas() {
    return this.prisma.farm.aggregate({
      _sum: {
        totalArea: true,
        agriculturalArea: true,
        vegetationArea: true,
      },
    });
  }

  farmsByState() {
    return this.prisma.farm.groupBy({
      by: ['state'],
      _count: { _all: true },
      orderBy: { state: 'asc' },
    });
  }

  farmsByCropFarmPairs() {
    return this.prisma.plantedCrop.groupBy({
      by: ['cropId', 'farmId'],
      orderBy: { cropId: 'asc' },
    });
  }

  findCropsByIds(ids: string[]) {
    return this.prisma.crop.findMany({ where: { id: { in: ids } } });
  }
}
