import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BlogPost as BlogPostType } from '../../types/blog';
import { PortableText } from '@portabletext/react';

import { getBlogService } from '../../services/BlogServiceFactory';
const blogService = getBlogService();




export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchPost = async () => {
      if (!slug) return;
      
      try {
        const post = await blogService.getPostBySlug(slug);
        setPost(post);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 pt-20 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-6 pt-20 max-w-4xl">
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Post Not Found</h2>
          <p className="text-gray-600">The blog post you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>{post.meta_title || post.title}</title>
      <meta name="description" content={post.meta_description || 'Read our latest blog post.'} />
      <div className="container mx-auto px-4 py-6 pt-20 max-w-4xl">
        <article className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center text-gray-600 text-sm md:text-base space-y-3 md:space-y-0">
            
            <div className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time className="text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          
            <PortableText value={post.body} components={{
              block: {
                h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-800 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-700 mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-gray-600 mb-4">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-4">{children}</ul>,
                li: ({ children }) => <li className="text-gray-600 mb-2">{children}</li>,
              },
              list: {
                bullet: ({ children }) => <ul className="list-disc list-inside mb-4">{children}</ul>,
                number: ({ children }) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
              },
              marks: {
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                link: ({ value, children }) => (
                  <a href={value.href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              },
            }} />
        </div>

        {post.categories && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.categories.map(category => (
                <span
                  key={category.title}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {category.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
    </>
  );
}
