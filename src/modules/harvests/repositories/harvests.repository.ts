import { Injectable } from '@nestjs/common';
import { Harvest, Prisma } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class HarvestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.HarvestCreateInput): Promise<Harvest> {
    return this.prisma.harvest.create({ data });
  }

  async findAll(query: PaginationQueryDto): Promise<[Harvest[], number]> {
    const where: Prisma.HarvestWhereInput = query.search ? { name: { contains: query.search, mode: 'insensitive' } } : {};
    return Promise.all([
      this.prisma.harvest.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { year: 'desc' },
      }),
      this.prisma.harvest.count({ where }),
    ]);
  }

  findById(id: string): Promise<Harvest | null> {
    return this.prisma.harvest.findUnique({ where: { id } });
  }

  findByName(name: string): Promise<Harvest | null> {
    return this.prisma.harvest.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } });
  }

  findByYear(year: number): Promise<Harvest | null> {
    return this.prisma.harvest.findUnique({ where: { year } });
  }

  update(id: string, data: Prisma.HarvestUpdateInput): Promise<Harvest> {
    return this.prisma.harvest.update({ where: { id }, data });
  }

  delete(id: string): Promise<Harvest> {
    return this.prisma.harvest.delete({ where: { id } });
  }
}
