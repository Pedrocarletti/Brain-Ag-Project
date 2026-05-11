import { NotFoundException } from '@nestjs/common';
import { ProducersService } from './producers.service';

describe('ProducersService', () => {
  const repository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByDocument: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  let service: ProducersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProducersService(repository as any);
  });

  it('normalizes document and infers document type on create', async () => {
    repository.create.mockResolvedValue({ id: '1' });
    repository.findByDocument.mockResolvedValue(null);
    await service.create({ document: '123.456.789-09', name: 'João' });
    expect(repository.create).toHaveBeenCalledWith({
      document: '12345678909',
      documentType: 'CPF',
      name: 'João',
    });
  });

  it('throws when producer is not found', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects duplicated producer document', async () => {
    repository.findByDocument.mockResolvedValue({ id: 'existing-id' });
    await expect(service.create({ document: '123.456.789-09', name: 'Duplicado' })).rejects.toThrow(
      'CPF/CNPJ já cadastrado.',
    );
  });
});
