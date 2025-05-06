import { Metadata } from 'next';
import { getDefaultMetadata, getPageMetadata } from './utils';

/**
 * Metadata configuration types
 */
export type MetadataProps = {
  title?: string;
  description?: string;
  ogImage?: string | string[];
  url?: string;
  noIndex?: boolean;
  keywords?: string[];
  authors?: Array<{ name: string; url?: string }>;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
};

/**
 * Generates structured data for SEO
 * @param type Type of structured data
 * @param data Custom data properties
 * @returns Structured data object
 */
export function generateStructuredData(type: 'Organization' | 'WebSite' | 'FAQPage' | 'Article', data?: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cognovain.vercel.app';
  
  const structuredData: Record<string, any> = {
    Organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Cognovain',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      sameAs: [
        'https://x.com/ZhiwarSajadi',
        'https://www.linkedin.com/in/zhiwar-sajadi-9119672ba/',
        'https://github.com/ZhiwarSajadin'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'zhiwarsajadizs@gmail.com',
        contactType: 'developer contact'
      }
    },
    WebSite: {
      '@context': 'https://cognovain.vercel.app',
      '@type': 'WebSite',
      name: 'Cognovain',
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    FAQPage: {
      '@context': 'https://cognovain.vercel.app',
      '@type': 'FAQPage',
      mainEntity: data?.faqs || []
    },
    Article: {
      '@context': 'https://cognovain.vercel.app',
      '@type': 'Article',
      headline: data?.title || 'Cognovain Article',
      description: data?.description || 'An article about Cognovain',
      image: data?.image || `${baseUrl}/og-image.jpg`,
      datePublished: data?.publishedTime || new Date().toISOString(),
      dateModified: data?.modifiedTime || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: data?.author || 'Cognovain Team'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Cognovain',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`
        }
      }
    }
  };

  return structuredData[type];
}

/**
 * Creates metadata for blog posts
 * @param post Blog post data
 * @returns Metadata object for the blog post
 */
export function getBlogPostMetadata(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  coverImage?: string;
  tags?: string[];
}): Metadata {
  const url = `/blog/${post.slug}`;
  
  return getDefaultMetadata({
    title: `${post.title} | Cognovain Blog`,
    description: post.description,
    url,
    ogImage: post.coverImage,
    keywords: post.tags,
    alternates: {
      canonical: url
    }
  });
}

/**
 * Creates metadata for product pages
 * @param product Product data
 * @returns Metadata object for the product page
 */
export function getProductMetadata(product: {
  name: string;
  description: string;
  slug: string;
  image?: string;
  features?: string[];
}): Metadata {
  const url = `/products/${product.slug}`;
  
  return getDefaultMetadata({
    title: `${product.name} | Cognovain Products`,
    description: product.description,
    url,
    ogImage: product.image,
    keywords: product.features,
    alternates: {
      canonical: url
    }
  });
}

/**
 * Creates JSON-LD script element for structured data
 * @param data Structured data object
 * @returns Script element with JSON-LD data
 */
export function createJsonLd(data: any) {
  return {
    __html: JSON.stringify(data)
  };
}

/**
 * Helper function to generate metadata for specific page types
 */
export const metadataGenerators = {
  home: () => getPageMetadata('home'),
  dashboard: () => getPageMetadata('dashboard'),
  submit: () => getPageMetadata('submit'),
  faq: () => getPageMetadata('faq'),
  blog: (props?: MetadataProps) => getDefaultMetadata({
    ...props,
    title: props?.title || 'Cognovain Blog - Insights on Cognitive Science',
    description: props?.description || 'Explore articles on cognitive science, thinking patterns, and mental frameworks.',
    keywords: props?.keywords || ['cognitive blog', 'cognitive science articles', 'thinking patterns', 'mental frameworks']
  }),
  about: () => getDefaultMetadata({
    title: 'About Cognovain - Our Mission & Team',
    description: 'Learn about Cognovain, our mission to improve cognitive understanding, and the team behind the platform.',
    keywords: ['about cognovain', 'cognitive science team', 'cognitive platform mission']
  }),
  contact: () => getDefaultMetadata({
    title: 'Contact Cognovain - Get in Touch',
    description: 'Have questions about Cognovain? Contact our team for support, partnership inquiries, or general information.',
    keywords: ['contact cognovain', 'cognitive science support', 'cognitive platform help']
  }),
  privacy: () => getDefaultMetadata({
    title: 'Privacy Policy - Cognovain',
    description: 'Read about how Cognovain handles your data and protects your privacy.',
    keywords: ['cognovain privacy', 'cognitive platform privacy', 'data protection']
  }),
  terms: () => getDefaultMetadata({
    title: 'Terms of Service - Cognovain',
    description: 'Review the terms and conditions for using the Cognovain platform.',
    keywords: ['cognovain terms', 'cognitive platform terms', 'service conditions']
  })
};