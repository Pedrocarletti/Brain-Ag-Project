import { Injectable } from '@nestjs/common';
import { Crop, Prisma } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CropsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.CropCreateInput): Promise<Crop> {
    return this.prisma.crop.create({ data });
  }

  async findAll(query: PaginationQueryDto): Promise<[Crop[], number]> {
    const where: Prisma.CropWhereInput = query.search ? { name: { contains: query.search, mode: 'insensitive' } } : {};
    return Promise.all([
      this.prisma.crop.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.crop.count({ where }),
    ]);
  }

  findById(id: string): Promise<Crop | null> {
    return this.prisma.crop.findUnique({ where: { id } });
  }

  findByName(name: string): Promise<Crop | null> {
    return this.prisma.crop.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } });
  }

  update(id: string, data: Prisma.CropUpdateInput): Promise<Crop> {
    return this.prisma.crop.update({ where: { id }, data });
  }

  delete(id: string): Promise<Crop> {
    return this.prisma.crop.delete({ where: { id } });
  }
}
