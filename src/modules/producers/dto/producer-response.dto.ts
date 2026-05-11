import { ApiProperty } from '@nestjs/swagger';

export class ProducerResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: '12345678909' })
  document!: string;

  @ApiProperty({ enum: ['CPF', 'CNPJ'], example: 'CPF' })
  documentType!: 'CPF' | 'CNPJ';

  @ApiProperty({ example: 'Joao da Silva' })
  name!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
