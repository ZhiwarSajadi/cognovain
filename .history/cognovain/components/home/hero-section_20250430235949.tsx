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
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-8 sm:mt-12 mb-6 sm:mb-8 text-center max-w-4xl leading-tight px-2">Unveil Your Cognition with Cognovain</h1>
                <h2 className="text-xl sm:text-2xl text-center text-gray-600 mb-10 sm:mb-16 max-w-2xl px-4">Spot cognitive errors and reframe thinking.</h2>
                <Button
                    variant={'link'}
                    className="text-white text-base sm:text-lg md:text-xl rounded-full px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-slate-900 to-rose-500 hover:from-rose-500 hover:to-slate-900 hover:no-underline font-medium shadow-lg transition-all duration-300 border-2 border-rose-300 dark:border-rose-700 hover:border-rose-400 dark:hover:border-rose-600 hover:shadow-rose-200/30 dark:hover:shadow-rose-700/20 hover:scale-105 transform-gpu"
                >
                    <Link href="/#plans" className="flex gap-2 sm:gap-3 items-center">
                        <span>Try Cognovain</span>
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                    </Link>
                </Button>
            </div>
        </section>
    );
}
