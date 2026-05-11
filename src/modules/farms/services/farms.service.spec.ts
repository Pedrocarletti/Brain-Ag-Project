import { BadRequestException } from '@nestjs/common';
import { FarmsService } from './farms.service';

describe('FarmsService', () => {
  const repository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByProducer: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const producersService = { findOne: jest.fn() };
  let service: FarmsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FarmsService(repository as any, producersService as any);
  });

  it('creates a valid farm and uppercases state', async () => {
    producersService.findOne.mockResolvedValue({ id: 'producer-id' });
    repository.create.mockResolvedValue({ id: 'farm-id' });
    await service.create({
      producerId: 'producer-id',
      farmName: 'Fazenda',
      city: 'Uberaba',
      state: 'mg',
      totalArea: 100,
      agriculturalArea: 60,
      vegetationArea: 20,
    });

    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ state: 'MG' }));
  });

  it('rejects invalid farm areas', async () => {
    await expect(
      service.create({
        producerId: 'producer-id',
        farmName: 'Fazenda',
        city: 'Uberaba',
        state: 'MG',
        totalArea: 100,
        agriculturalArea: 80,
        vegetationArea: 30,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
