'use client'

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="relative mx-auto flex flex-col z-0 items-center justify-center min-h-[50vh] py-16 sm:py-20 lg:py-24 transition-all animate-in lg:px-12 max-w-7xl">
      <div className="flex flex-col items-center justify-center w-full px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6 max-w-3xl">
          Ready to Unveil Your Congintion?
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Reframe statements into clear, correct insights with our AI-powered cognition.
        </p>
        <Link 
          href="/#plans" 
          className="inline-flex items-center px-8 py-3 rounded-md font-medium bg-rose-600 text-white hover:bg-rose-700 transition-colors"
        >
          Get Started →
        </Link>
      </div>
    </section>
  );
}
