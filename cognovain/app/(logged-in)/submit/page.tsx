import BgGradient from "@/components/ui/common/bg-gradient";
import UploadHeader from "@/components/upload/upload-header";
import UploadForm from "@/components/upload/upload-form";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <section className="min-h-screen">
        <BgGradient/>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <SignedIn>
            <div className="flex flex-col items-center justify-center gap-6 text-center">
              <UploadHeader/>
              <UploadForm/>
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex flex-col items-center justify-center gap-6 text-center">
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-red-700 mb-3">Authentication Required</h2>
                <p className="text-gray-700 mb-4">You must be signed in to submit entries to Cognovain.</p>
                <div className="flex gap-4 justify-center">
                  <Link href="/sign-in" className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700">
                    Sign In
                  </Link>
                  <Link href="/sign-up" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </SignedOut>
        </div>
    </section>
  )
}