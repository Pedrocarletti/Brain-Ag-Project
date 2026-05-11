import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Producer } from '@prisma/client';
import { buildPaginatedResponse, PaginatedResponse } from '../../../common/dto/paginated-response.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { normalizeText } from '../../../common/normalizers/text.normalizer';
import { inferDocumentType, onlyDigits } from '../../../common/validators/document.validator';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { ProducersRepository } from '../repositories/producers.repository';

@Injectable()
export class ProducersService {
  private readonly logger = new Logger(ProducersService.name);

  constructor(private readonly repository: ProducersRepository) {}

  async create(dto: CreateProducerDto): Promise<Producer> {
    const document = onlyDigits(dto.document);
    const existing = await this.repository.findByDocument(document);
    if (existing) throw new ConflictException('CPF/CNPJ já cadastrado.');
    this.logger.log({ event: 'producer.create', document });
    return this.repository.create({
      document,
      documentType: inferDocumentType(document),
      name: normalizeText(dto.name),
    });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponse<Producer>> {
    const [data, total] = await this.repository.findAll(query);
    return buildPaginatedResponse(data, total, query.page, query.limit);
  }

  async findOne(id: string): Promise<Producer> {
    const producer = await this.repository.findById(id);
    if (!producer) throw new NotFoundException('Produtor não encontrado.');
    return producer;
  }

  async update(id: string, dto: UpdateProducerDto): Promise<Producer> {
    await this.findOne(id);
    const data = dto.document
      ? { ...dto, document: onlyDigits(dto.document), documentType: inferDocumentType(dto.document) }
      : dto;
    if (data.name) data.name = normalizeText(data.name);
    if (data.document) {
      const existing = await this.repository.findByDocument(data.document);
      if (existing && existing.id !== id) throw new ConflictException('CPF/CNPJ já cadastrado.');
    }
    this.logger.log({ event: 'producer.update', id });
    return this.repository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    this.logger.log({ event: 'producer.delete', id });
    await this.repository.delete(id);
  }
}
