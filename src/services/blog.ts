import { BlogPost, BlogListResponse } from '../types/blog';
import sanityClient from './sanityClient';

export interface BlogService {
  getPosts(page: number, pageSize: number): Promise<BlogListResponse>;
  getPostBySlug(slug: string): Promise<BlogPost | null>;
  searchPosts(query: string): Promise<BlogPost[]>;
}

// Temporary mock implementation - can be replaced with actual CMS integration
/** 
export class MockBlogService implements BlogService {
  private mockPosts: BlogPost[] = [
  /**   
    {
      id: '1',
      slug: 'understanding-mortgage-amortization',
      title: 'Understanding Mortgage Amortization',
      featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      content: `
# Understanding Mortgage Amortization

When you take out a mortgage, understanding how amortization works is crucial for making informed financial decisions. This guide will walk you through the concepts.

## What is Amortization?

Amortization refers to the process of paying off a debt (in this case, a mortgage) through regular payments that cover both principal and interest. Over time, the proportion of your payment that goes toward principal increases, while the portion going to interest decreases.

## Key Components

1. **Principal**: The original amount borrowed
2. **Interest**: The cost of borrowing money
3. **Payment Schedule**: Usually monthly payments
4. **Loan Term**: Typically 15 or 30 years

## Why Understanding Amortization Matters

- Better budgeting and financial planning
- Understanding the true cost of your mortgage
- Making informed decisions about extra payments
- Evaluating refinancing options

## Using Our Calculator

Our amortization calculator helps you:
1. Calculate monthly payments
2. View detailed payment schedules
3. Understand principal vs. interest allocation
4. Plan extra payments effectively

Visit our calculator to start planning your mortgage payments today!`,

      excerpt: 'Learn the fundamentals of mortgage amortization and how it affects your home loan payments over time.',
      publishedAt: '2025-04-02T12:00:00Z',
      status: 'published',
      tags: ['mortgage', 'finance', 'guide', 'basics'],
    }
    {
      id: '2',
      slug: 'early-mortgage-payoff-strategies',
      title: '5 Effective Strategies for Early Mortgage Payoff',
      featuredImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      content: `
# 5 Effective Strategies for Early Mortgage Payoff

Paying off your mortgage early can save you thousands in interest payments. Here are five proven strategies to help you achieve this goal.

## 1. Make Bi-weekly Payments

Instead of making 12 monthly payments, make 26 bi-weekly payments. This results in an extra monthly payment each year, reducing your loan term and interest costs.

## 2. Round Up Your Payments

Round up your monthly payment to the nearest hundred. For example, if your payment is $1,450, pay $1,500. This small increase can make a significant difference over time.

## 3. Apply Extra Income

Use bonuses, tax refunds, or other windfalls to make extra mortgage payments. Be sure to specify that these extra payments should go toward the principal.

## 4. Refinance to a Shorter Term

Consider refinancing from a 30-year to a 15-year mortgage if rates are favorable. While monthly payments will be higher, you'll pay less interest overall.

## 5. Make One Extra Payment Annually

Set aside money each month to make one additional mortgage payment per year. This strategy can help you pay off your mortgage years earlier.

Use our amortization calculator to see how these strategies could affect your mortgage payoff timeline!`,
      excerpt: 'Discover five practical strategies to pay off your mortgage faster and save money on interest payments.',
      publishedAt: '2025-04-01T10:00:00Z',
      status: 'published',
      tags: ['mortgage', 'strategy', 'savings', 'finance'],
    },
    {
      id: '3',
      slug: 'comparing-15-vs-30-year-mortgages',
      title: '15 vs 30 Year Mortgages: Making the Right Choice',
      featuredImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      content: `
# 15 vs 30 Year Mortgages: Making the Right Choice

Choosing between a 15-year and 30-year mortgage is one of the most significant financial decisions you'll make. Let's analyze both options to help you make an informed choice.

## 15-Year Mortgage Benefits

1. **Lower total interest paid**
2. **Faster equity building**
3. **Earlier debt freedom**
4. **Better interest rates**

## 30-Year Mortgage Benefits

1. **Lower monthly payments**
2. **More financial flexibility**
3. **Greater investment opportunities**
4. **Better cash flow management**

## Comparing the Numbers

Let's look at a $300,000 mortgage at current market rates:

### 15-Year Mortgage
- Monthly payment: Higher
- Total interest paid: Lower
- Complete ownership: 15 years

### 30-Year Mortgage
- Monthly payment: Lower
- Total interest paid: Higher
- Complete ownership: 30 years

## Making Your Decision

Consider these factors:
- Current income stability
- Other financial goals
- Risk tolerance
- Investment opportunities
- Retirement planning

Use our calculator to compare different scenarios and find what works best for you!`,
      excerpt: 'Compare the pros and cons of 15-year and 30-year mortgages to make the best choice for your financial situation.',
      publishedAt: '2025-03-30T14:30:00Z',
      status: 'published',
      tags: ['mortgage', 'comparison', 'finance', 'planning'],
    }
  ];

  async getPosts(page: number, pageSize: number): Promise<BlogListResponse> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const posts = this.mockPosts.slice(start, end);

    return {
      posts,
      total: this.mockPosts.length,
      page,
      pageSize,
    };
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    return this.mockPosts.find(post => post.slug === slug) || null;
  }

  async searchPosts(query: string): Promise<BlogPost[]> {
    return this.mockPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase())
    );
  }

}

*/

// CMS integration - Sanity
export class SanityBlogService implements BlogService {
  async getPosts(page: number, pageSize: number): Promise<BlogListResponse> {
    const start = (page - 1) * pageSize;
    const posts = await sanityClient.fetch(
      `*[_type == "post"] | order(publishedAt desc) [${start}...${start + pageSize}] {
        _id,
        title,
        slug,
        mainImage,
        body,
        publishedAt,
      }`
    );

    const total = await sanityClient.fetch('count(*[_type == "post"])');

    return {
      posts,
      total,
      page,
      pageSize,
    };
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const post = await sanityClient.fetch(
        `*[_type == "post" && slug.current == $slug][0] {
          _id,  
          title,
          slug->{current},
          mainImage,
          publishedAt,
          author->{name},
          categories[]->{title},
          body[]{
            ...,
            children[]{
              ...,
            }
          },
          meta_title,
          meta_description,
          }`,
      { slug }
    );
    console.log('Post:', post);
    return post;
  }

  async searchPosts(query: string): Promise<BlogPost[]> {
    return await sanityClient.fetch(
      `*[_type == "post" && (title match $query || content match $query)] {
        _id,
        title,
        slug,
        mainImage,
        body,
        publishedAt,
      }`,
      { query: `*${query}*` as never }
    );
  }
}