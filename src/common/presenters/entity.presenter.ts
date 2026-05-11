import { Decimal } from '@prisma/client/runtime/library';

function serializeValue(value: unknown): unknown {
  if (value instanceof Decimal) return value.toNumber();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(serializeValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, serializeValue(item)]));
  }
  return value;
}

export function presentEntity<T>(entity: T): T {
  return serializeValue(entity) as T;
}

export function presentMany<T>(entities: T[]): T[] {
  return entities.map((entity) => presentEntity(entity));
}
