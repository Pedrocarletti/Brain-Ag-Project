import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  it('returns aggregated dashboard data', async () => {
    const repository = {
      countFarms: jest.fn().mockResolvedValue(2),
      sumAreas: jest.fn().mockResolvedValue({
        _sum: { totalArea: 1500, agriculturalArea: 1000, vegetationArea: 300 },
      }),
      farmsByState: jest.fn().mockResolvedValue([{ state: 'MG', _count: { _all: 2 } }]),
      farmsByCropFarmPairs: jest.fn().mockResolvedValue([{ cropId: 'crop-id', farmId: 'farm-id' }]),
      findCropsByIds: jest.fn().mockResolvedValue([{ id: 'crop-id', name: 'Soja' }]),
    };
    const service = new DashboardService(repository as any);

    await expect(service.getDashboard()).resolves.toEqual({
      totalFarms: 2,
      totalHectares: 1500,
      farmsByState: [{ state: 'MG', count: 2 }],
      farmsByCrop: [{ crop: 'Soja', count: 1 }],
      landUse: { agriculturalArea: 1000, vegetationArea: 300 },
    });
  });

  it('counts distinct farms by crop in the dashboard', async () => {
    const repository = {
      countFarms: jest.fn().mockResolvedValue(2),
      sumAreas: jest.fn().mockResolvedValue({
        _sum: { totalArea: 1500, agriculturalArea: 900, vegetationArea: 400 },
      }),
      farmsByState: jest.fn().mockResolvedValue([]),
      farmsByCropFarmPairs: jest.fn().mockResolvedValue([
        { cropId: 'soy-id', farmId: 'farm-1' },
        { cropId: 'soy-id', farmId: 'farm-2' },
        { cropId: 'corn-id', farmId: 'farm-1' },
      ]),
      findCropsByIds: jest.fn().mockResolvedValue([
        { id: 'soy-id', name: 'Soja' },
        { id: 'corn-id', name: 'Milho' },
      ]),
    };
    const service = new DashboardService(repository as any);

    await expect(service.getDashboard()).resolves.toMatchObject({
      farmsByCrop: [
        { crop: 'Soja', count: 2 },
        { crop: 'Milho', count: 1 },
      ],
    });
  });
});
