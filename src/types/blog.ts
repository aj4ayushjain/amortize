export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author?: Author;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  status: 'draft' | 'published';
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface BlogListResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
}
