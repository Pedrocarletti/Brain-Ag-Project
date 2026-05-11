import { Module } from '@nestjs/common';
import { HarvestsController } from './controllers/harvests.controller';
import { HarvestsRepository } from './repositories/harvests.repository';
import { HarvestsService } from './services/harvests.service';

@Module({
  controllers: [HarvestsController],
  providers: [HarvestsService, HarvestsRepository],
  exports: [HarvestsService],
})
export class HarvestsModule {}
