import { isValidCnpj, isValidCpf, isValidDocument, onlyDigits } from './document.validator';

describe('document validator', () => {
  it('validates CPF with and without mask', () => {
    expect(isValidCpf('123.456.789-09')).toBe(true);
    expect(isValidCpf('12345678909')).toBe(true);
  });

  it('rejects invalid CPF', () => {
    expect(isValidCpf('111.111.111-11')).toBe(false);
    expect(isValidCpf('12345678900')).toBe(false);
  });

  it('validates CNPJ with and without mask', () => {
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true);
    expect(isValidCnpj('11222333000181')).toBe(true);
  });

  it('rejects invalid CNPJ', () => {
    expect(isValidCnpj('11.111.111/1111-11')).toBe(false);
    expect(isValidDocument('123')).toBe(false);
  });

  it('removes masks', () => {
    expect(onlyDigits('11.222.333/0001-81')).toBe('11222333000181');
  });
});
