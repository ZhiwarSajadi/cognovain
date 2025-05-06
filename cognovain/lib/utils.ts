import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Metadata } from "next"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates metadata base URL using the environment variable or fallback URL
 */
export function getMetadataBase() {
  return new URL(process.env.NEXT_PUBLIC_APP_URL || "https://cognovain.vercel.app")
}

/**
 * Generates OpenGraph metadata for SEO
 * @param props Custom OpenGraph properties
 * @returns OpenGraph metadata object
 */
export function getOpenGraph(props?: {
  title?: string
  description?: string
  url?: string
  images?: string | string[]
  type?: 'website' | 'article' | 'profile'
  siteName?: string
  locale?: string
  publishedTime?: string
  authors?: string[]
}) {
  const title = props?.title ?? "Cognovain - The Cognitive Platform"
  const description = props?.description ?? "Unveil the unseen patterns of your cognition with Cognovain"
  const url = props?.url ?? "/"
  const type = props?.type ?? "website"
  const siteName = props?.siteName ?? "Cognovain"
  const locale = props?.locale ?? "en_US"
  
  const ogMetadata: any = {
    type,
    locale,
    url,
    title,
    description,
    siteName,
    images: props?.images 
      ? typeof props.images === "string" 
        ? [props.images] 
        : props.images
      : ["/og-image.jpg"],
  }

  // Add article-specific metadata if type is article
  if (type === 'article' && props?.publishedTime) {
    ogMetadata.publishedTime = props.publishedTime
    if (props?.authors?.length) {
      ogMetadata.authors = props.authors
    }
  }

  return ogMetadata
}

/**
 * Generates page-specific metadata for different routes
 * @param props Page-specific metadata properties
 * @returns Metadata object for the specific page
 */
export function getPageMetadata(pageName: string, props?: {
  title?: string
  description?: string
  ogImage?: string | string[]
  url?: string
  noIndex?: boolean
  keywords?: string[]
}): Metadata {
  // Define page-specific metadata configurations
  const pageConfigs: Record<string, {
    title: string
    description: string
    keywords?: string[]
    ogImage?: string
  }> = {
    home: {
      title: "Cognovain - Unveil Your Cognitive Patterns",
      description: "Discover and optimize your cognitive processes with Cognovain, the platform that helps you understand your thinking patterns.",
      keywords: ["cognitive analysis", "thinking patterns", "cognitive optimization", "mental framework"],
      ogImage: "/og-home.jpg"
    },
    dashboard: {
      title: "Your Cognitive Dashboard - Cognovain",
      description: "View your cognitive analysis results and track your progress over time.",
      keywords: ["cognitive dashboard", "personal analytics", "cognitive tracking", "thinking patterns"],
      ogImage: "/og-dashboard.jpg"
    },
    submit: {
      title: "Submit Your Entry - Cognovain",
      description: "Submit your thoughts for cognitive analysis and gain insights into your thinking patterns.",
      keywords: ["cognitive submission", "thought analysis", "cognitive insights", "thinking evaluation"],
      ogImage: "/og-submit.jpg"
    },
    faq: {
      title: "Frequently Asked Questions - Cognovain",
      description: "Find answers to common questions about Cognovain and cognitive analysis.",
      keywords: ["cognitive science FAQ", "Cognovain help", "cognitive analysis questions"],
      ogImage: "/og-faq.jpg"
    }
  }

  // Get the configuration for the specified page, or use default if not found
  const pageConfig = pageConfigs[pageName] || {
    title: "Cognovain - The Cognitive Platform",
    description: "Unveil the unseen patterns of your cognition with Cognovain."
  }

  // Merge page-specific config with any custom props
  return getDefaultMetadata({
    title: props?.title || pageConfig.title,
    description: props?.description || pageConfig.description,
    ogImage: props?.ogImage || pageConfig.ogImage,
    url: props?.url,
    noIndex: props?.noIndex,
    keywords: props?.keywords || pageConfig.keywords
  })
}

/**
 * Generates default metadata for pages
 * @param props Custom metadata properties
 * @returns Metadata object
 */
export function getDefaultMetadata(props?: {
  title?: string
  description?: string
  ogImage?: string | string[]
  url?: string
  noIndex?: boolean
  keywords?: string[]
  authors?: Array<{ name: string; url?: string }>
  alternates?: {
    canonical?: string
    languages?: Record<string, string>
  }
}): Metadata {
  const defaultKeywords = [
    "cognitive bias", 
    "cognitive errors", 
    "AI analysis", 
    "mental framework", 
    "thinking patterns", 
    "cognitive reframing",
    "cognitive science",
    "decision making",
    "critical thinking",
    "cognitive psychology"
  ];

  const defaultTitle = "Cognovain - The Cognitive Platform";
  const defaultDescription = "Unveil the unseen patterns of your cognition with Cognovain, your gateway to understanding and optimizing cognitive processes.";
  
  return {
    title: props?.title ?? defaultTitle,
    description: props?.description ?? defaultDescription,
    keywords: props?.keywords ?? defaultKeywords,
    authors: props?.authors ?? [{ name: "Cognovain Creator", url: "https://github.com/ZhiwarSajadi" }],
    creator: "Zhiwar Sajadi",
    publisher: "Zhiwar Sajadi",
    metadataBase: getMetadataBase(),
    openGraph: getOpenGraph({
      title: props?.title,
      description: props?.description,
      url: props?.url,
      images: props?.ogImage
    }),
    twitter: {
      card: "summary_large_image",
      title: props?.title ?? defaultTitle,
      description: props?.description ?? defaultDescription,
      creator: "@ZhiwarSajadi",
      images: props?.ogImage ? 
        (typeof props.ogImage === "string" ? [props.ogImage] : props.ogImage) : 
        ["/og-image.jpg"]
    },
    robots: {
      index: props?.noIndex ? false : true,
      follow: props?.noIndex ? false : true,
      googleBot: {
        index: props?.noIndex ? false : true,
        follow: props?.noIndex ? false : true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    },
    alternates: props?.alternates ?? {
      canonical: props?.url
    },
    applicationName: "Cognovain",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    },
    category: "cognitive science"
  }
}
