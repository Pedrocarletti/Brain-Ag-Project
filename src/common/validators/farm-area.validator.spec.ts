import { BadRequestException } from '@nestjs/common';
import { FARM_AREA_ERROR_MESSAGE, validateFarmAreas } from './farm-area.validator';

describe('farm area validator', () => {
  it('accepts valid farm areas', () => {
    expect(() => validateFarmAreas(100, 60, 30)).not.toThrow();
  });

  it('rejects total area lower than area usage', () => {
    expect(() => validateFarmAreas(100, 70, 40)).toThrow(new BadRequestException(FARM_AREA_ERROR_MESSAGE));
  });

  it('rejects non-positive and negative areas', () => {
    expect(() => validateFarmAreas(0, 0, 0)).toThrow(BadRequestException);
    expect(() => validateFarmAreas(100, -1, 0)).toThrow(BadRequestException);
  });
});
