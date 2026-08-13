export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface PaginatedCategories {
  items: Category[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoryInput {
  name: string;
  description?: string;
}
