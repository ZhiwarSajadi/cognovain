'use client';

import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react";
import { Info, PenLine } from "lucide-react";

interface UploadFormInputProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading?: boolean;
}

const MAX_CHARS = 2000;
const TEXTAREA_PLACEHOLDER = "Enter your statement here to analyze for cognitive biases...";

export default function UploadFormInput({ onSubmit, isLoading = false }: UploadFormInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [charCount, setCharCount] = useState(0);
    const [showHint, setShowHint] = useState(false);
    
    useEffect(() => {
        // Auto-focus the textarea when component mounts
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
        
        // Show the hint tooltip after a delay
        const timer = setTimeout(() => {
            setShowHint(true);
        }, 2000);
        
        return () => clearTimeout(timer);
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
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Update character count
        setCharCount(e.target.value.length);
        
        // Hide the hint when user starts typing
        if (showHint) {
            setShowHint(false);
        }
    };
    
    // Calculate character count status
    const isNearLimit = charCount > MAX_CHARS * 0.8;
    const isAtLimit = charCount >= MAX_CHARS;
    
    return (
        <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-6 w-full max-w-xl">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label 
                        htmlFor="cognitive-statement" 
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                    >
                        <PenLine className="h-4 w-4" />
                        Your statement
                    </label>
                    <div 
                        className={`text-xs ${
                            isAtLimit 
                                ? "text-red-600 dark:text-red-400 font-medium" 
                                : isNearLimit 
                                    ? "text-amber-600 dark:text-amber-400" 
                                    : "text-gray-500 dark:text-gray-400"
                        }`}
                    >
                        {charCount}/{MAX_CHARS} characters
                    </div>
                </div>
                
                <div className="relative">
                    <textarea 
                        ref={textareaRef}
                        id="cognitive-statement"
                        name="statement" 
                        placeholder={TEXTAREA_PLACEHOLDER}
                        className={`rounded-lg border ${
                            isAtLimit 
                                ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500" 
                                : "border-gray-300 dark:border-gray-600 focus:ring-rose-600 focus:border-rose-600"
                        } bg-white dark:bg-gray-800 py-3 px-4 shadow-sm focus:outline-none focus:ring-1 min-h-[180px] w-full resize-y text-gray-900 dark:text-gray-100 dark:placeholder-gray-400 transition-colors duration-200`}
                        required
                        disabled={isLoading}
                        rows={6}
                        maxLength={MAX_CHARS}
                        aria-describedby="statement-hint"
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}
                    />
                    
                    {/* Keyboard shortcut hint */}
                    <div 
                        className="absolute right-2 bottom-2 text-xs text-gray-400 dark:text-gray-500 select-none 
                                  bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700"
                    >
                        Press <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 
                                            rounded border border-gray-300 dark:border-gray-600 mx-1">
                            Ctrl+Enter
                        </kbd> to submit
                    </div>
                    
                    {/* Helper tooltip that appears briefly */}
                    {showHint && (
                        <div className="absolute -top-2 left-4 transform -translate-y-full bg-white dark:bg-gray-800 
                                       p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 
                                       text-sm max-w-xs z-10 animate-fade-in">
                            <div className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
                                <p className="text-gray-600 dark:text-gray-300 text-xs">
                                    Write a statement that you'd like to analyze for cognitive biases or thinking errors.
                                </p>
                            </div>
                            <div className="absolute w-3 h-3 bg-white dark:bg-gray-800 border-b border-r border-gray-200 
                                           dark:border-gray-700 transform rotate-45 left-6 -bottom-1.5"></div>
                        </div>
                    )}
                </div>
                
                {/* Helper text */}
                <p id="statement-hint" className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    For best results, be specific and detailed about your thoughts or feelings.
                </p>
            </div>
            
            <Button 
                type="submit" 
                disabled={isLoading || isAtLimit}
                aria-label={isLoading ? "Processing your statement" : "Analyze my statement"}
                className={`text-white rounded-full px-10 py-6 transition-all duration-300 font-medium shadow-sm ${
                    isLoading || isAtLimit
                        ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed opacity-70"
                        : "bg-gradient-to-r from-slate-900 to-rose-500 hover:from-rose-500 hover:to-slate-900"
                }`}
            >
                {isLoading ? 'Analyzing...' : 'Analyze Statement'}
            </Button>
        </form>
    )
}