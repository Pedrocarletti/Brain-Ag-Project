import { BadRequestException } from '@nestjs/common';

export const FARM_AREA_ERROR_MESSAGE =
  'A soma da área agricultável com a área de vegetação não pode ultrapassar a área total da fazenda.';

export function validateFarmAreas(totalArea: number, agriculturalArea: number, vegetationArea: number): void {
  if (totalArea <= 0) {
    throw new BadRequestException('A área total deve ser maior que zero.');
  }
  if (agriculturalArea < 0 || vegetationArea < 0) {
    throw new BadRequestException('As áreas agricultável e de vegetação não podem ser negativas.');
  }
  if (agriculturalArea + vegetationArea > totalArea) {
    throw new BadRequestException(FARM_AREA_ERROR_MESSAGE);
  }
}
