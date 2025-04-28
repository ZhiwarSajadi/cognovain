import Link from 'next/link';
import { Brain } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    <Link href="/#plans" className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
                        Plans
                    </Link>
                    <Link href="/#faq" className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
                        FAQ
                    </Link>
                    <Link href="/sign-in" className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
                        Login
                    </Link>
                    <Link href="/sign-up" className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
                        Sign Up
                    </Link>
                </div>
                <div className="mt-8 md:order-1 md:mt-0">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <Brain className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                        <span className="font-bold text-gray-900 dark:text-gray-100">Cognovain</span>
                    </div>
                    <p className="text-center text-xs leading-5 text-gray-500 dark:text-gray-400 md:text-left">
                        &copy; {currentYear} Cognovain. All rights reserved.
                    </p>
                    <p className="text-center text-xs leading-5 text-gray-500 dark:text-gray-400 mt-1 md:text-left">
                        Unveil the unseen patterns of your cognition.
                    </p>
                </div>
            </div>
        </footer>
    );
}