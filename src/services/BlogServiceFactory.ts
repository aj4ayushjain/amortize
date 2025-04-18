import { SanityBlogService } from './blog';

export function getBlogService() {
  return new SanityBlogService();
}