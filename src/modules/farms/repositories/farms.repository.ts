import { Injectable } from '@nestjs/common';
import { Farm, Prisma } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class FarmsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.FarmCreateInput): Promise<Farm> {
    return this.prisma.farm.create({ data });
  }

  async findAll(query: PaginationQueryDto & { state?: string; producerId?: string }): Promise<[Farm[], number]> {
    const where: Prisma.FarmWhereInput = {
      ...(query.search
        ? {
            OR: [
              { farmName: { contains: query.search, mode: 'insensitive' } },
              { city: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.state ? { state: query.state.toUpperCase() } : {}),
      ...(query.producerId ? { producerId: query.producerId } : {}),
    };
    return Promise.all([
      this.prisma.farm.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
        include: { producer: true, plantedCrops: { include: { crop: true, harvest: true } } },
      }),
      this.prisma.farm.count({ where }),
    ]);
  }

  findById(id: string): Promise<Farm | null> {
    return this.prisma.farm.findUnique({ where: { id }, include: { producer: true, plantedCrops: { include: { crop: true, harvest: true } } } });
  }

  findByProducer(producerId: string): Promise<Farm[]> {
    return this.prisma.farm.findMany({ where: { producerId }, orderBy: { createdAt: 'desc' } });
  }

  update(id: string, data: Prisma.FarmUpdateInput): Promise<Farm> {
    return this.prisma.farm.update({ where: { id }, data });
  }

  delete(id: string): Promise<Farm> {
    return this.prisma.farm.delete({ where: { id } });
  }
}
