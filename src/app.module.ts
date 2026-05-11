import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { validateEnv } from './config/env.validation';
import { PrismaModule } from './database/prisma.module';
import { CropsModule } from './modules/crops/crops.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { FarmsModule } from './modules/farms/farms.module';
import { HarvestsModule } from './modules/harvests/harvests.module';
import { PlantedCropsModule } from './modules/planted-crops/planted-crops.module';
import { ProducersModule } from './modules/producers/producers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? ['.env.test', '.env'] : ['.env'],
      validate: validateEnv,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
        transport:
          process.env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: { singleLine: true, colorize: true },
              }
            : undefined,
        customProps: (req) => ({
          requestId: req.id,
        }),
      },
    }),
    PrismaModule,
    ProducersModule,
    FarmsModule,
    HarvestsModule,
    CropsModule,
    PlantedCropsModule,
    DashboardModule,
  ],
})
export class AppModule {}
