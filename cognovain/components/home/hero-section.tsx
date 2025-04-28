import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative mx-auto flex flex-col z-0 items-center justify-center min-h-[60vh] py-16 sm:py-20 lg:py-24 transition-all animate-in lg:px-12 max-w-7xl">
            <div className="flex flex-col items-center justify-center w-full px-4">
                <div className="flex justify-center w-full mb-8">
                    <div className="relative p-[2px] overflow-hidden rounded-full bg-gradient-to-r from-rose-200 via-rose-500 to-rose-800 hover:from-rose-500 hover:via-rose-800 hover:to-rose-200 transition-all duration-300">
                        <Badge variant={'secondary'} className="relative px-8 py-3 text-lg font-medium bg-white dark:bg-black rounded-full">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                                <p className="text-rose-600 dark:text-rose-400 text-lg">Powered by AI</p>
                            </div>
                        </Badge>
                    </div>
                </div>
                <h1 className="text-6xl lg:text-7xl font-bold mt-12 mb-8 text-center max-w-4xl leading-tight">Unveil Your Cognition with Cognovain</h1>
                <h2 className="text-2xl text-center text-gray-600 mb-16 max-w-2xl">Spot cognitive errors and reframe thinking.</h2>
                <Button
                    variant={'link'}
                    className="text-white text-xl rounded-full px-10 py-4 bg-gradient-to-r from-slate-900 to-rose-500 hover:from-rose-500 hover:to-slate-900 hover:no-underline font-medium shadow-md transition-all duration-300 border-2 border-transparent hover:border-rose-300 dark:hover:border-rose-700"
                >
                    <Link href="/#plans" className="flex gap-3 items-center">
                        <span>Try Cognovain</span>
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </Button>
            </div>
        </section>
    );
}
