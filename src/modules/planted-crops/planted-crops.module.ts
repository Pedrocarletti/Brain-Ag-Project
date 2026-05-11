import { Module } from '@nestjs/common';
import { CropsModule } from '../crops/crops.module';
import { FarmsModule } from '../farms/farms.module';
import { HarvestsModule } from '../harvests/harvests.module';
import { PlantedCropsController } from './controllers/planted-crops.controller';
import { PlantedCropsRepository } from './repositories/planted-crops.repository';
import { PlantedCropsService } from './services/planted-crops.service';

@Module({
  imports: [FarmsModule, CropsModule, HarvestsModule],
  controllers: [PlantedCropsController],
  providers: [PlantedCropsService, PlantedCropsRepository],
})
export class PlantedCropsModule {}
