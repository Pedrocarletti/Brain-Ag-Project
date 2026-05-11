import { Module } from '@nestjs/common';
import { ProducersController } from './controllers/producers.controller';
import { ProducersRepository } from './repositories/producers.repository';
import { ProducersService } from './services/producers.service';

@Module({
  controllers: [ProducersController],
  providers: [ProducersService, ProducersRepository],
  exports: [ProducersService],
})
export class ProducersModule {}
