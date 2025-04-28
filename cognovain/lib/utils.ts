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
  return new URL(process.env.NEXT_PUBLIC_APP_URL || "https://cognovain.com")
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
}) {
  const title = props?.title ?? "Cognovain - The Cognitive Platform"
  const description = props?.description ?? "Unveil the unseen patterns of your cognition with Cognovain"
  const url = props?.url ?? "/"
  
  return {
    type: "website",
    locale: "en_US",
    url,
    title,
    description,
    siteName: "Cognovain",
    images: props?.images 
      ? typeof props.images === "string" 
        ? [props.images] 
        : props.images
      : ["/og-image.jpg"],
  }
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
}): Metadata {
  return {
    title: props?.title ?? "Cognovain - The Cognitive Platform",
    description: props?.description ?? "Unveil the unseen patterns of your cognition with Cognovain, your gateway to understanding and optimizing cognitive processes.",
    keywords: ["cognitive bias", "cognitive errors", "AI analysis", "mental framework", "thinking patterns", "cognitive reframing"],
    authors: [{ name: "Cognovain Team" }],
    creator: "Cognovain",
    publisher: "Cognovain",
    metadataBase: getMetadataBase(),
    openGraph: getOpenGraph({
      title: props?.title,
      description: props?.description,
      url: props?.url,
      images: props?.ogImage
    }),
    twitter: {
      card: "summary_large_image",
      title: props?.title ?? "Cognovain - The Cognitive Platform",
      description: props?.description ?? "Unveil the unseen patterns of your cognition with Cognovain"
    },
    robots: {
      index: true,
      follow: true
    }
  }
}
