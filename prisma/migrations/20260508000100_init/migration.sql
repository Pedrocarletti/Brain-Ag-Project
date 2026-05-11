CREATE TYPE "DocumentType" AS ENUM ('CPF', 'CNPJ');

CREATE TABLE "producers" (
    "id" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "producers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "farms" (
    "id" TEXT NOT NULL,
    "producerId" TEXT NOT NULL,
    "farmName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "totalArea" DECIMAL(12,2) NOT NULL,
    "agriculturalArea" DECIMAL(12,2) NOT NULL,
    "vegetationArea" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "harvests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "harvests_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "crops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "crops_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "planted_crops" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "cropId" TEXT NOT NULL,
    "harvestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "planted_crops_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "producers_document_key" ON "producers"("document");
CREATE INDEX "farms_producerId_idx" ON "farms"("producerId");
CREATE UNIQUE INDEX "harvests_name_key" ON "harvests"("name");
CREATE UNIQUE INDEX "harvests_year_key" ON "harvests"("year");
CREATE UNIQUE INDEX "crops_name_key" ON "crops"("name");
CREATE INDEX "planted_crops_farmId_idx" ON "planted_crops"("farmId");
CREATE INDEX "planted_crops_cropId_idx" ON "planted_crops"("cropId");
CREATE INDEX "planted_crops_harvestId_idx" ON "planted_crops"("harvestId");
CREATE UNIQUE INDEX "planted_crops_farmId_cropId_harvestId_key" ON "planted_crops"("farmId", "cropId", "harvestId");

ALTER TABLE "farms" ADD CONSTRAINT "farms_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "producers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "planted_crops" ADD CONSTRAINT "planted_crops_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "planted_crops" ADD CONSTRAINT "planted_crops_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "crops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "planted_crops" ADD CONSTRAINT "planted_crops_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "harvests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
