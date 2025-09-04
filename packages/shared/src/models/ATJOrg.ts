// ATJ Organization related types

export interface ATJOrg {
  id: number;
  organization_name: string;
  country: string;
  representative_name: string;
  representative_title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateATJOrgRequest {
  organization_name: string;
  country: string;
  representative_name: string;
  representative_title: string;
}

export interface UpdateATJOrgRequest {
  organization_name?: string;
  country?: string;
  representative_name?: string;
  representative_title?: string;
}

export interface ATJOrgSearchFilters {
  organization_name?: string;
  country?: string;
  representative_name?: string;
  representative_title?: string;
  limit?: number;
  offset?: number;
}

export interface ATJOrgSearchResult {
  items: ATJOrg[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// Ensure this file is treated as a module
export {};
