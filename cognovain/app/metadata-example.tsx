/**
 * This is an example file demonstrating how to use the enhanced metadata system
 * in different pages of your Next.js application.
 */

import { Metadata } from 'next';
import { getDefaultMetadata, getPageMetadata } from '@/lib/utils';
import { getBlogPostMetadata, getProductMetadata, generateStructuredData, metadataGenerators } from '@/lib/metadata';

// Example 1: Using default metadata for a simple page
export const metadata: Metadata = getDefaultMetadata({
  title: 'Custom Page Title',
  description: 'This is a custom page description that will be used for SEO.',
});

// Example 2: Using page-specific metadata for a known page type
// export const metadata: Metadata = getPageMetadata('dashboard', {
//   // Override specific properties if needed
//   title: 'My Personal Dashboard',
// });

// Example 3: Using blog post metadata
// export const metadata: Metadata = getBlogPostMetadata({
//   title: 'Understanding Cognitive Biases',
//   description: 'Learn about common cognitive biases and how to recognize them in your thinking.',
//   slug: 'understanding-cognitive-biases',
//   publishedAt: '2023-05-15T12:00:00Z',
//   author: 'Dr. Jane Smith',
//   coverImage: '/blog/cognitive-biases-cover.jpg',
//   tags: ['cognitive bias', 'critical thinking', 'psychology']
// });

// Example 4: Using product metadata
// export const metadata: Metadata = getProductMetadata({
//   name: 'Cognitive Analysis Tool',
//   description: 'A powerful tool for analyzing cognitive patterns and identifying biases.',
//   slug: 'cognitive-analysis-tool',
//   image: '/products/analysis-tool.jpg',
//   features: ['bias detection', 'pattern recognition', 'personalized insights']
// });

// Example 5: Using predefined metadata generators
// export const metadata: Metadata = metadataGenerators.about();

// Example 6: Adding structured data to your page
export default function MetadataExamplePage() {
  // Generate structured data for the page
  const organizationData = generateStructuredData('Organization');
  const faqData = generateStructuredData('FAQPage', {
    faqs: [
      {
        '@type': 'Question',
        name: 'What is Cognovain?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cognovain is a platform that helps you understand and optimize your cognitive processes.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does Cognovain work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cognovain analyzes your thinking patterns and provides insights to help you make better decisions.'
        }
      }
    ]
  });

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />

      <h1 className="text-3xl font-bold mb-6">Metadata Implementation Examples</h1>
      
      <div className="prose max-w-none">
        <p>
          This page demonstrates how to use the enhanced metadata system in your Next.js application.
          Check the source code to see different examples of metadata implementation.
        </p>
        
        <h2>Available Metadata Functions</h2>
        <ul>
          <li><code>getDefaultMetadata()</code> - Basic metadata for any page</li>
          <li><code>getPageMetadata()</code> - Pre-configured metadata for specific page types</li>
          <li><code>getBlogPostMetadata()</code> - Metadata optimized for blog posts</li>
          <li><code>getProductMetadata()</code> - Metadata optimized for product pages</li>
          <li><code>metadataGenerators</code> - Shorthand functions for common pages</li>
          <li><code>generateStructuredData()</code> - Create structured data for SEO</li>
        </ul>
        
        <h2>Implementation Tips</h2>
        <ol>
          <li>Choose the appropriate metadata function based on your page type</li>
          <li>Override default values only when necessary</li>
          <li>Include structured data for enhanced SEO</li>
          <li>Use canonical URLs to prevent duplicate content issues</li>
          <li>Set appropriate noIndex flags for non-public pages</li>
        </ol>
        
        <p>
          For more information, refer to the documentation in the <code>lib/metadata.ts</code> and <code>lib/utils.ts</code> files.
        </p>
      </div>
    </div>
  );
}