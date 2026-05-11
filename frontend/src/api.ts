const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Producer {
  id: string;
  document: string;
  documentType: 'CPF' | 'CNPJ';
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Farm {
  id: string;
  producerId: string;
  farmName: string;
  city: string;
  state: string;
  totalArea: number;
  agriculturalArea: number;
  vegetationArea: number;
  createdAt: string;
  updatedAt: string;
}

export interface Harvest {
  id: string;
  name: string;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface Crop {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlantedCrop {
  id: string;
  farmId: string;
  cropId: string;
  harvestId: string;
  farm?: Farm;
  crop?: Crop;
  harvest?: Harvest;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  totalFarms: number;
  totalHectares: number;
  farmsByState: Array<{ state: string; count: number }>;
  farmsByCrop: Array<{ crop: string; count: number }>;
  landUse: {
    agriculturalArea: number;
    vegetationArea: number;
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly payload: unknown,
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload && typeof payload === 'object' && 'message' in payload ? String((payload as { message: unknown }).message) : 'Erro na requisição.';
    throw new ApiError(message, response.status, payload);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function query(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value));
  });
  const text = search.toString();
  return text ? `?${text}` : '';
}

export const api = {
  dashboard: () => request<DashboardData>('/dashboard'),

  producers: {
    list: (search = '') => request<PaginatedResponse<Producer>>(`/producers${query({ page: 1, limit: 100, search })}`),
    create: (payload: { document: string; name: string }) => request<Producer>('/producers', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: Partial<{ document: string; name: string }>) =>
      request<Producer>(`/producers/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    remove: (id: string) => request<void>(`/producers/${id}`, { method: 'DELETE' }),
  },

  farms: {
    list: (search = '') => request<PaginatedResponse<Farm>>(`/farms${query({ page: 1, limit: 100, search })}`),
    byProducer: (producerId: string) => request<Farm[]>(`/farms/by-producer/${producerId}`),
    create: (payload: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>) => request<Farm>('/farms', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: Partial<Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>>) =>
      request<Farm>(`/farms/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    remove: (id: string) => request<void>(`/farms/${id}`, { method: 'DELETE' }),
  },

  harvests: {
    list: (search = '') => request<PaginatedResponse<Harvest>>(`/harvests${query({ page: 1, limit: 100, search })}`),
    create: (payload: { name: string; year: number }) => request<Harvest>('/harvests', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: Partial<{ name: string; year: number }>) =>
      request<Harvest>(`/harvests/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    remove: (id: string) => request<void>(`/harvests/${id}`, { method: 'DELETE' }),
  },

  crops: {
    list: (search = '') => request<PaginatedResponse<Crop>>(`/crops${query({ page: 1, limit: 100, search })}`),
    create: (payload: { name: string }) => request<Crop>('/crops', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: Partial<{ name: string }>) => request<Crop>(`/crops/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    remove: (id: string) => request<void>(`/crops/${id}`, { method: 'DELETE' }),
  },

  plantedCrops: {
    list: () => request<PaginatedResponse<PlantedCrop>>('/planted-crops?page=1&limit=100'),
    byFarm: (farmId: string) => request<PlantedCrop[]>(`/planted-crops/by-farm/${farmId}`),
    create: (payload: { farmId: string; cropId: string; harvestId: string }) =>
      request<PlantedCrop>('/planted-crops', { method: 'POST', body: JSON.stringify(payload) }),
    remove: (id: string) => request<void>(`/planted-crops/${id}`, { method: 'DELETE' }),
  },
};
