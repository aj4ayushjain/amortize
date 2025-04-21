import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types/blog';
import { getBlogService } from '../../services/BlogServiceFactory';
import { urlFor } from '@/services/sanityClient';

const blogService = getBlogService();


interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }:BlogPostCardProps) {

  
  return (
    <article
      key={post._id}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      <Link to={`/blog/${post.slug?.current}`} className="block">
        {post.mainImage ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={urlFor(post.mainImage.asset).url()}
              alt={post.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary">
            {post.title}
          </h2>
          <div className="flex flex-col text-sm text-gray-500">
            <span className="font-medium text-gray-700">{post.author?.name}</span>
            <time>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blogService.getPosts(1, 10);
        setPosts(response.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogPostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
