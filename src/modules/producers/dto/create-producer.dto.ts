import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsCpfOrCnpj } from '../../../common/validators/document.validator';

export class CreateProducerDto {
  @ApiProperty({ example: '123.456.789-09' })
  @IsString()
  @IsNotEmpty()
  @IsCpfOrCnpj()
  document!: string;

  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;
}
