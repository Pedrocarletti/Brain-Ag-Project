import { Module } from '@nestjs/common';
import { CropsController } from './controllers/crops.controller';
import { CropsRepository } from './repositories/crops.repository';
import { CropsService } from './services/crops.service';

@Module({
  controllers: [CropsController],
  providers: [CropsService, CropsRepository],
  exports: [CropsService],
})
export class CropsModule {}
