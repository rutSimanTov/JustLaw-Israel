// ATJ (Access to Justice) related types

export interface ATJ {
  id: number;
  name: string;
  country: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateATJRequest {
  name: string;
  country: string;
}

export interface UpdateATJRequest {
  name?: string;
  country?: string;
}

export interface ATJSearchFilters {
  name?: string;
  country?: string;
  limit?: number;
  offset?: number;
}

export interface ATJSearchResult {
  items: ATJ[];
  totalCount: number;
  page: number;
  pageSize: number;
}
