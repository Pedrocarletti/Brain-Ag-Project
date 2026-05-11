import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.plantedCrop.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.crop.deleteMany();
  await prisma.harvest.deleteMany();
  await prisma.producer.deleteMany();

  const [producerA, producerB] = await Promise.all([
    prisma.producer.create({
      data: { document: '12345678909', documentType: 'CPF', name: 'João da Silva' },
    }),
    prisma.producer.create({
      data: { document: '11222333000181', documentType: 'CNPJ', name: 'Agro Santa Clara LTDA' },
    }),
  ]);

  const [safra2025, safra2026] = await Promise.all([
    prisma.harvest.create({ data: { name: 'Safra 2025', year: 2025 } }),
    prisma.harvest.create({ data: { name: 'Safra 2026', year: 2026 } }),
  ]);

  const [soja, milho, cafe, algodao] = await Promise.all([
    prisma.crop.create({ data: { name: 'Soja' } }),
    prisma.crop.create({ data: { name: 'Milho' } }),
    prisma.crop.create({ data: { name: 'Café' } }),
    prisma.crop.create({ data: { name: 'Algodão' } }),
  ]);

  const [farmA, farmB, farmC] = await Promise.all([
    prisma.farm.create({
      data: {
        producerId: producerA.id,
        farmName: 'Fazenda Santa Clara',
        city: 'Uberaba',
        state: 'MG',
        totalArea: 1000,
        agriculturalArea: 700,
        vegetationArea: 200,
      },
    }),
    prisma.farm.create({
      data: {
        producerId: producerA.id,
        farmName: 'Sítio Boa Vista',
        city: 'Ribeirão Preto',
        state: 'SP',
        totalArea: 500,
        agriculturalArea: 350,
        vegetationArea: 100,
      },
    }),
    prisma.farm.create({
      data: {
        producerId: producerB.id,
        farmName: 'Fazenda Cerrado Verde',
        city: 'Rio Verde',
        state: 'GO',
        totalArea: 1200,
        agriculturalArea: 850,
        vegetationArea: 250,
      },
    }),
  ]);

  await prisma.plantedCrop.createMany({
    data: [
      { farmId: farmA.id, cropId: soja.id, harvestId: safra2025.id },
      { farmId: farmA.id, cropId: milho.id, harvestId: safra2025.id },
      { farmId: farmA.id, cropId: cafe.id, harvestId: safra2026.id },
      { farmId: farmB.id, cropId: soja.id, harvestId: safra2026.id },
      { farmId: farmC.id, cropId: algodao.id, harvestId: safra2026.id },
    ],
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
