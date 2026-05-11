import { Injectable } from '@nestjs/common';
import { Prisma, Producer } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

@Injectable()
export class ProducersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ProducerCreateInput): Promise<Producer> {
    return this.prisma.producer.create({ data });
  }

  async findAll(query: PaginationQueryDto): Promise<[Producer[], number]> {
    const where: Prisma.ProducerWhereInput = query.search
      ? { name: { contains: query.search, mode: 'insensitive' } }
      : {};
    return Promise.all([
      this.prisma.producer.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
        include: { farms: true },
      }),
      this.prisma.producer.count({ where }),
    ]);
  }

  findByDocument(document: string): Promise<Producer | null> {
    return this.prisma.producer.findUnique({ where: { document } });
  }

  findById(id: string): Promise<Producer | null> {
    return this.prisma.producer.findUnique({ where: { id }, include: { farms: true } });
  }

  update(id: string, data: Prisma.ProducerUpdateInput): Promise<Producer> {
    return this.prisma.producer.update({ where: { id }, data });
  }

  delete(id: string): Promise<Producer> {
    return this.prisma.producer.delete({ where: { id } });
  }
}
