import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateHarvestDto {
  @ApiProperty({ example: 'Safra 2026' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 2026 })
  @IsInt()
  @Min(1900)
  @Max(2200)
  year!: number;
}
