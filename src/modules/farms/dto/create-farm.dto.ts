import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, Length, MaxLength, Min } from 'class-validator';

export class CreateFarmDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  producerId!: string;

  @ApiProperty({ example: 'Fazenda Santa Clara' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  farmName!: string;

  @ApiProperty({ example: 'Uberaba' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: 'MG' })
  @IsString()
  @Length(2, 2)
  state!: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsPositive()
  totalArea!: number;

  @ApiProperty({ example: 700 })
  @IsNumber()
  @Min(0)
  agriculturalArea!: number;

  @ApiProperty({ example: 250 })
  @IsNumber()
  @Min(0)
  vegetationArea!: number;
}
