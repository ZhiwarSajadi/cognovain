'use client';

import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react";

interface UploadFormInputProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading?: boolean;
}

export default function UploadFormInput({ onSubmit, isLoading = false }: UploadFormInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    
    useEffect(() => {
        // Auto-focus the textarea when component mounts
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Submit the form when Ctrl+Enter or Cmd+Enter is pressed
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (formRef.current && !isLoading) {
                e.preventDefault();
                formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
        }
    };
    
    return (
        <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-6 w-full max-w-xl">
            <div className="relative">
                <textarea 
                    ref={textareaRef}
                    name="statement" 
                    placeholder="Enter your statement here to analyze for cognitive biases..." 
                    className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-3 px-4 shadow-sm focus:outline-none focus:ring-1 focus:ring-rose-600 focus:border-rose-600 min-h-[180px] w-full resize-y text-gray-900 dark:text-gray-100 dark:placeholder-gray-400" 
                    required
                    disabled={isLoading}
                    rows={6}
                    onKeyDown={handleKeyDown}
                />
                <div className="absolute right-2 bottom-2 text-xs text-gray-400 dark:text-gray-500 select-none bg-white dark:bg-gray-800 px-1 rounded">
                    Press Ctrl+Enter to submit
                </div>
            </div>
            <Button 
                type="submit" 
                disabled={isLoading}
                className="text-white rounded-full px-10 py-6 bg-gradient-to-r from-slate-900 to-rose-500 hover:from-rose-500 hover:to-slate-900 font-medium shadow-sm transition-all duration-300"
            >
                {isLoading ? 'Analyzing...' : 'Submit'}
            </Button>
        </form>
    )
}