import { Injectable, Logger } from '@nestjs/common';
import { DashboardRepository } from '../repositories/dashboard.repository';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private readonly repository: DashboardRepository) {}

  async getDashboard() {
    this.logger.log({ event: 'dashboard.query' });
    const [totalFarms, areaSums, byState, cropFarmPairs] = await Promise.all([
      this.repository.countFarms(),
      this.repository.sumAreas(),
      this.repository.farmsByState(),
      this.repository.farmsByCropFarmPairs(),
    ]);

    const byCrop = cropFarmPairs.reduce<Map<string, number>>((acc, item) => {
      acc.set(item.cropId, (acc.get(item.cropId) ?? 0) + 1);
      return acc;
    }, new Map());
    const crops = await this.repository.findCropsByIds(Array.from(byCrop.keys()));
    const cropNameById = new Map(crops.map((crop) => [crop.id, crop.name]));

    return {
      totalFarms,
      totalHectares: Number(areaSums._sum.totalArea ?? 0),
      farmsByState: byState.map((item) => ({ state: item.state, count: item._count._all })),
      farmsByCrop: Array.from(byCrop.entries()).map(([cropId, count]) => ({
        crop: cropNameById.get(cropId) ?? cropId,
        count,
      })),
      landUse: {
        agriculturalArea: Number(areaSums._sum.agriculturalArea ?? 0),
        vegetationArea: Number(areaSums._sum.vegetationArea ?? 0),
      },
    };
  }
}
