export interface Post {
  id: string;
  title: {
    en: string;
    ru: string;
  };
  excerpt: {
    en: string;
    ru: string;
  };
  slug: string;
  featuredImage: string;
  createdAt: string;
  author: {
    name: string | null;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}