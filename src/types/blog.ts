export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface Slug  {
  current: string;
  _type: "slug";
};



export interface BlogPost {
  _id: string;
  slug?: Slug;
  _type: "post";
  _rev: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  body: {
    _type: 'block' | 'image' | 'code' | 'video' | 'audio' | 'table' | 'list';
    children?: {
      _type: string;
      text: string;
      marks: string[];
    }[];
    markDefs?: {
      _type: string;
      _key: string;
      href: string;
    }[];
  }[];
  mainImage?: {
    _upload?: {
      previewImage: string; // base64 string
      file: {
        name: string; // URL to the image
        type: string;
      };
    }
    
  }; 
  author?: Author;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  categories?: {
    _type: 'reference';
    _ref: string;
    title: string;
  }[];
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
