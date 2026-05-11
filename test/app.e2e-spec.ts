import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/configure-app';
import { PrismaService } from '../src/database/prisma.service';

describe('Rural Producers API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5433/rural_producers_test?schema=public';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app, { enableSwagger: false });
    prisma = app.get(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    await prisma.plantedCrop.deleteMany();
    await prisma.farm.deleteMany();
    await prisma.crop.deleteMany();
    await prisma.harvest.deleteMany();
    await prisma.producer.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('covers producer, farm, harvest, crop, planted crop and dashboard flows', async () => {
    const producer = await request(app.getHttpServer())
      .post('/producers')
      .send({ document: '123.456.789-09', name: 'João da Silva' })
      .expect(201)
      .then((res) => res.body);

    await request(app.getHttpServer())
      .post('/producers')
      .send({ document: '123', name: 'Documento inválido' })
      .expect(400);

    await request(app.getHttpServer())
      .post('/producers')
      .send({ document: '12345678909', name: 'Duplicado' })
      .expect(409);

    await request(app.getHttpServer()).get('/producers').expect(200).expect(({ body }) => {
      expect(body.data).toHaveLength(1);
      expect(body.meta.total).toBe(1);
    });

    await request(app.getHttpServer()).get(`/producers/${producer.id}`).expect(200).expect(({ body }) => {
      expect(body.id).toBe(producer.id);
    });

    await request(app.getHttpServer())
      .patch(`/producers/${producer.id}`)
      .send({ name: 'Joao Atualizado' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.name).toBe('Joao Atualizado');
      });

    const farm = await request(app.getHttpServer())
      .post('/farms')
      .send({
        producerId: producer.id,
        farmName: 'Fazenda Santa Clara',
        city: 'Uberaba',
        state: 'MG',
        totalArea: 1000,
        agriculturalArea: 700,
        vegetationArea: 200,
      })
      .expect(201)
      .then((res) => res.body);

    await request(app.getHttpServer()).get('/farms').expect(200).expect(({ body }) => {
      expect(body.data).toHaveLength(1);
      expect(body.meta.total).toBe(1);
    });

    await request(app.getHttpServer()).get(`/farms/${farm.id}`).expect(200).expect(({ body }) => {
      expect(body.id).toBe(farm.id);
    });

    await request(app.getHttpServer()).get(`/farms/by-producer/${producer.id}`).expect(200).expect(({ body }) => {
      expect(body).toHaveLength(1);
    });

    await request(app.getHttpServer())
      .patch(`/farms/${farm.id}`)
      .send({ farmName: 'Fazenda Santa Clara II', totalArea: 1100 })
      .expect(200)
      .expect(({ body }) => {
        expect(body.farmName).toBe('Fazenda Santa Clara II');
        expect(body.totalArea).toBe(1100);
      });

    await request(app.getHttpServer())
      .post('/farms')
      .send({
        producerId: producer.id,
        farmName: 'Fazenda Inválida',
        city: 'Uberaba',
        state: 'MG',
        totalArea: 100,
        agriculturalArea: 80,
        vegetationArea: 30,
      })
      .expect(400);

    const harvest = await request(app.getHttpServer())
      .post('/harvests')
      .send({ name: 'Safra 2026', year: 2026 })
      .expect(201)
      .then((res) => res.body);

    await request(app.getHttpServer()).get('/harvests').expect(200).expect(({ body }) => {
      expect(body.data).toHaveLength(1);
    });

    await request(app.getHttpServer()).get(`/harvests/${harvest.id}`).expect(200).expect(({ body }) => {
      expect(body.id).toBe(harvest.id);
    });

    await request(app.getHttpServer())
      .patch(`/harvests/${harvest.id}`)
      .send({ name: 'Safra 2026/2027' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.name).toBe('Safra 2026/2027');
      });

    const crop = await request(app.getHttpServer())
      .post('/crops')
      .send({ name: 'Soja' })
      .expect(201)
      .then((res) => res.body);

    await request(app.getHttpServer()).get('/crops').expect(200).expect(({ body }) => {
      expect(body.data).toHaveLength(1);
    });

    await request(app.getHttpServer()).get(`/crops/${crop.id}`).expect(200).expect(({ body }) => {
      expect(body.id).toBe(crop.id);
    });

    await request(app.getHttpServer())
      .patch(`/crops/${crop.id}`)
      .send({ name: 'Soja Premium' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.name).toBe('Soja Premium');
      });

    await request(app.getHttpServer()).post('/crops').send({ name: 'soja premium' }).expect(409);

    await request(app.getHttpServer())
      .post('/planted-crops')
      .send({ farmId: farm.id, cropId: crop.id, harvestId: harvest.id })
      .expect(201)
      .then((res) => res.body);

    await request(app.getHttpServer())
      .post('/planted-crops')
      .send({ farmId: farm.id, cropId: crop.id, harvestId: harvest.id })
      .expect(409);

    const plantedCrop = await request(app.getHttpServer())
      .get('/planted-crops')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data).toHaveLength(1);
      })
      .then((res) => res.body.data[0]);

    await request(app.getHttpServer())
      .get(`/planted-crops/by-farm/${farm.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
      });

    const dashboard = await request(app.getHttpServer()).get('/dashboard').expect(200).then((res) => res.body);
    expect(dashboard).toMatchObject({
      totalFarms: 1,
      totalHectares: 1100,
      farmsByState: [{ state: 'MG', count: 1 }],
      farmsByCrop: [{ crop: 'Soja Premium', count: 1 }],
      landUse: { agriculturalArea: 700, vegetationArea: 200 },
    });

    await request(app.getHttpServer()).delete(`/planted-crops/${plantedCrop.id}`).expect(204);
    await request(app.getHttpServer()).delete(`/farms/${farm.id}`).expect(204);
    await request(app.getHttpServer()).delete(`/producers/${producer.id}`).expect(204);
    await request(app.getHttpServer()).delete(`/harvests/${harvest.id}`).expect(204);
    await request(app.getHttpServer()).delete(`/crops/${crop.id}`).expect(204);
  });
});
