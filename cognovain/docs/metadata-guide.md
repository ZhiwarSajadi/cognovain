# Cognovain Metadata Implementation Guide

This guide explains how to use the enhanced metadata system implemented in the Cognovain project.

## Overview

The metadata system provides comprehensive SEO and social media optimization for the Cognovain platform. It includes:

- Default metadata for all pages
- Page-specific metadata configurations
- Blog post and product page metadata helpers
- Structured data generation for rich search results
- OpenGraph and Twitter card optimization

## Available Utilities

### Core Metadata Functions

- `getDefaultMetadata()` - Provides base metadata for any page
- `getPageMetadata()` - Pre-configured metadata for specific page types (home, dashboard, etc.)
- `getOpenGraph()` - Generates OpenGraph metadata for social sharing

### Specialized Metadata Functions

- `getBlogPostMetadata()` - Optimized metadata for blog posts
- `getProductMetadata()` - Optimized metadata for product pages
- `generateStructuredData()` - Creates JSON-LD structured data for SEO
- `createJsonLd()` - Helper to create script elements with JSON-LD data

### Shorthand Generators

The `metadataGenerators` object provides quick access to pre-configured metadata for common pages:

- `metadataGenerators.home()`
- `metadataGenerators.dashboard()`
- `metadataGenerators.submit()`
- `metadataGenerators.faq()`
- `metadataGenerators.blog()`
- `metadataGenerators.about()`
- `metadataGenerators.contact()`
- `metadataGenerators.privacy()`
- `metadataGenerators.terms()`

## Implementation Examples

### Basic Page Metadata

```typescript
// In your page file
import { Metadata } from 'next';
import { getDefaultMetadata } from '@/lib/utils';

export const metadata: Metadata = getDefaultMetadata({
  title: 'Page Title',
  description: 'Page description for SEO',
});
```

### Page-Specific Metadata

```typescript
import { Metadata } from 'next';
import { getPageMetadata } from '@/lib/utils';

export const metadata: Metadata = getPageMetadata('dashboard', {
  // Override specific properties if needed
  title: 'My Dashboard',
});
```

### Blog Post Metadata

```typescript
import { Metadata } from 'next';
import { getBlogPostMetadata } from '@/lib/metadata';

export const metadata: Metadata = getBlogPostMetadata({
  title: 'Blog Post Title',
  description: 'Blog post description',
  slug: 'post-slug',
  publishedAt: '2023-05-15T12:00:00Z',
  author: 'Author Name',
  coverImage: '/blog/cover.jpg',
  tags: ['tag1', 'tag2']
});
```

### Adding Structured Data

```typescript
import { generateStructuredData } from '@/lib/metadata';

export default function Page() {
  const organizationData = generateStructuredData('Organization');
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      {/* Page content */}
    </>
  );
}
```

## Best Practices

1. **Choose the appropriate function** based on your page type
2. **Override only what's necessary** - the default values are optimized for SEO
3. **Include structured data** for enhanced search results
4. **Use canonical URLs** to prevent duplicate content issues
5. **Set noIndex flags** for non-public pages
6. **Keep metadata concise** - titles under 60 characters, descriptions under 160
7. **Use relevant keywords** but avoid keyword stuffing

## File Structure

- `lib/utils.ts` - Contains core metadata functions
- `lib/metadata.ts` - Contains specialized metadata utilities
- `app/metadata-example.tsx` - Example implementation

## Further Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [OpenGraph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)