'use client';

import { useState, useRef, useEffect } from 'react';
import UploadFormInput from "@/components/upload/upload-form-input";
import { generateAnalysisFromGemini } from '@/lib/geminiai';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { saveAnalysisToHistory } from '@/actions/analysis';
import { useNotification } from '@/components/ui/common/notification-provider';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export default function UploadForm() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userStatement, setUserStatement] = useState<string>('');
    const { showNotification } = useNotification();
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = formData.get('statement') as string;
        
        // Reset previous results and errors
        setError(null);
        
        if (!data || data.trim() === '') {
            setError('Please enter a statement to analyze');
            return;
        }
        
        setUserStatement(data);
        
        try {
            setIsAnalyzing(true);
            console.log('Analyzing statement:', data);
            const analysis = await generateAnalysisFromGemini(data);
            setAnalysisResult(analysis);
            
            // Save analysis to history in Supabase
            try {
                const result = await saveAnalysisToHistory({
                    statement: data,
                    analysis: analysis,
                    createdAt: new Date(),
                });
                
                if (result.success) {
                    showNotification('Analysis saved to your history', 'success');
                }
            } catch (historyError) {
                console.error('Error saving analysis to history:', historyError);
                // Non-blocking error - the analysis will still be shown
                showNotification('Analysis completed but could not be saved to history', 'info');
            }
        } catch (error: any) {
            console.error('Error analyzing statement:', error);
            
            let errorMessage = 'Error analyzing your statement. Please try again.';
            if (error.message === 'RATE_LIMIT_EXCEEDED') {
                errorMessage = 'Our AI service is currently busy. Please try again in a few minutes.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            setAnalysisResult(null);
            
            showNotification(errorMessage, 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    return (
        <div className="w-full max-w-lg flex flex-col items-center gap-6">
           <UploadFormInput onSubmit={handleSubmit} isLoading={isAnalyzing} />
           
           {/* Loading state with improved visual */}
           {isAnalyzing && (
             <div className="mt-6 p-6 w-full border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black shadow-sm flex flex-col items-center justify-center">
               <div className="relative w-16 h-16 mb-4">
                 <div className="absolute inset-0 border-4 border-rose-200 dark:border-rose-950 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-rose-600 dark:border-rose-500 rounded-full border-t-transparent animate-spin"></div>
                 <Loader2 className="absolute inset-0 h-full w-full text-rose-600 dark:text-rose-500 animate-pulse p-2" />
               </div>
               <p className="text-gray-800 dark:text-gray-200 font-medium">Analyzing your statement...</p>
               <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">This may take a few seconds</p>
             </div>
           )}
           
           {/* Error state */}
           {error && !isAnalyzing && (
             <div className="mt-6 p-6 w-full border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-950/30 shadow-sm">
               <div className="flex items-start gap-3">
                 <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                 <div>
                   <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Analysis Error</h3>
                   <p className="text-gray-700 dark:text-gray-300 mb-3">{error}</p>
                   <div className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 p-3 rounded border border-red-100 dark:border-red-900/50">
                     <p className="font-medium mb-1">Try these solutions:</p>
                     <ul className="list-disc pl-5 space-y-1">
                       <li>Make sure your statement is clear and complete</li>
                       <li>Try again in a few moments if the service is busy</li>
                       <li>Check your internet connection</li>
                     </ul>
                   </div>
                 </div>
               </div>
             </div>
           )}
           
           {/* Result state */}
           {analysisResult && !isAnalyzing && (
             <div className="mt-6 p-4 sm:p-6 w-full border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black shadow-lg overflow-auto min-h-[400px] h-auto max-w-full transition-all duration-300 ease-in-out" style={{ maxHeight: '1000px', width: 'calc(100% - 2px)' }}>
               <div className="flex items-center gap-3 mb-5">
                 <div className="w-2 h-10 bg-gradient-to-b from-rose-500 to-slate-900 rounded-full shadow-md"></div>
                 <h3 className="text-xl font-semibold dark:text-white bg-gradient-to-r from-rose-700 to-slate-900 bg-clip-text text-transparent">Analysis Result</h3>
               </div>
               <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-5 rounded-lg border border-gray-100 dark:border-gray-800 mb-6 shadow-inner animate-fade-in transition-all duration-300">
                 <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                   Original Statement
                 </h4>
                 <p className="text-gray-700 dark:text-gray-300 italic text-sm sm:text-base border-l-4 border-rose-300 dark:border-rose-700 pl-3 py-1 bg-rose-50/50 dark:bg-rose-950/20 rounded-r-sm">"{userStatement}"</p>
               </div>
               <div className="prose max-w-none dark:prose-invert w-full overflow-x-auto bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-inner transition-all duration-300">
                 {analysisResult.split('\n').map((paragraph, index) => {
                   // Enhanced highlighting for cognitive biases with more patterns
                   const highlightedText = paragraph.replace(
                     /(cognitive bias|logical fallacy|thinking error|cognitive distortion|black and white thinking|catastrophizing|overgeneralization|personalization|emotional reasoning|mental filter|jumping to conclusions|should statements|labeling|magnification|minimization|fortune telling|mind reading|disqualifying the positive|all-or-nothing thinking|filtering|polarized thinking|heaven's reward fallacy|control fallacy|fallacy of fairness|blaming|always being right|fallacy of change|global labeling|mislabeling|fallacy of attachment|discounting the positive|dichotomous thinking|arbitrary inference|selective abstraction|over-generalization|maximization|minimization|confirmation bias|hindsight bias|self-serving bias|attribution bias|framing effect|anchoring bias|availability heuristic|halo effect|fundamental attribution error|optimism bias|pessimism bias|dunning-kruger effect|actor-observer bias|sunk cost fallacy|false consensus effect|bandwagon effect|self-fulfilling prophecy|negativity bias|positive bias|recency bias|just world hypothesis|spotlight effect|gambler's fallacy|illusory correlation|projection bias|normalcy bias|reactance|regret aversion|status quo bias|outcome bias|moral luck|appeal to authority|appeal to emotion|appeal to ignorance|appeal to nature|appeal to novelty|appeal to tradition|appeal to hypocrisy|straw man fallacy|circular reasoning|ad hominem|slippery slope|false dilemma|hasty generalization|appeal to probability|appeal to force|bandwagon fallacy|no true scotsman|loaded question|ambiguity|perfect solution fallacy|thought-action fusion|emotional reasoning|compare and despair|cross-examination|excessive apologizing|overvaluing social approval|perfectionism|dismissal of positive|rejecting compliments|ignoring achievements|diminishing success|downplaying positives|disregarding strengths|refusal to accept praise|invalidating positive feedback|overlooking positive aspects|trivializing success|underestimating capabilities|refusing to acknowledge progress|denial of improvement|rejection of positive evidence|devaluing personal qualities|negating positive traits|discrediting positive experiences|diminishing personal worth|invalidating positive results|undermining accomplishments|discarding positive feedback|rejecting evidence of success|dismissing positive qualities|minimizing achievements|refusing recognition)/gi,
                     '<span class="font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-1 rounded shadow-sm">$1</span>'
                   );
                   
                   return (
                     <div 
                       key={index} 
                       className="mb-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base transition-opacity duration-300 ease-in"
                       dangerouslySetInnerHTML={{ __html: highlightedText }}
                     />
                   );
                 })}
               </div>
               <div className="flex justify-end mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                 <button 
                   onClick={() => {
                     navigator.clipboard.writeText(`Analysis of: "${userStatement}"\n\n${analysisResult}`);
                     showNotification('Analysis copied to clipboard', 'success');
                   }}
                   className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                     <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                   </svg>
                   Copy to clipboard
                 </button>
               </div>
             </div>
           )}
        </div>
    );
}