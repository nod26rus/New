export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryUpdate {
  id: string;
  name?: string;
  order?: number;
  isActive?: boolean;
}