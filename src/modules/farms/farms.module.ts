import { Module } from '@nestjs/common';
import { ProducersModule } from '../producers/producers.module';
import { FarmsController } from './controllers/farms.controller';
import { FarmsRepository } from './repositories/farms.repository';
import { FarmsService } from './services/farms.service';

@Module({
  imports: [ProducersModule],
  controllers: [FarmsController],
  providers: [FarmsService, FarmsRepository],
  exports: [FarmsService],
})
export class FarmsModule {}
