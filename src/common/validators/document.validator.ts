import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1+$/.test(cpf)) return false;

  const calc = (factor: number): number => {
    let total = 0;
    for (let i = 0; i < factor - 1; i += 1) total += Number(cpf[i]) * (factor - i);
    const digit = (total * 10) % 11;
    return digit === 10 ? 0 : digit;
  };

  return calc(10) === Number(cpf[9]) && calc(11) === Number(cpf[10]);
}

export function isValidCnpj(value: string): boolean {
  const cnpj = onlyDigits(value);
  if (!/^\d{14}$/.test(cnpj) || /^(\d)\1+$/.test(cnpj)) return false;

  const calc = (weights: number[]): number => {
    const total = weights.reduce((sum, weight, index) => sum + Number(cnpj[index]) * weight, 0);
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  return calc([5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === Number(cnpj[12])
    && calc([6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === Number(cnpj[13]);
}

export function inferDocumentType(value: string): 'CPF' | 'CNPJ' {
  return onlyDigits(value).length === 11 ? 'CPF' : 'CNPJ';
}

export function isValidDocument(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length === 11) return isValidCpf(digits);
  if (digits.length === 14) return isValidCnpj(digits);
  return false;
}

export function IsCpfOrCnpj(validationOptions?: ValidationOptions) {
  return function register(object: object, propertyName: string): void {
    registerDecorator({
      name: 'isCpfOrCnpj',
      target: object.constructor,
      propertyName,
      options: {
        message: 'CPF/CNPJ inválido.',
        ...validationOptions,
      },
      validator: {
        validate(value: unknown): boolean {
          return typeof value === 'string' && isValidDocument(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} deve ser um CPF ou CNPJ válido.`;
        },
      },
    });
  };
}
