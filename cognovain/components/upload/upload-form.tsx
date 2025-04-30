'use client';

import { useState, useRef, useEffect } from 'react';
import UploadFormInput from "@/components/upload/upload-form-input";
import { generateAnalysisFromGemini } from '@/lib/geminiai';
import { AlertTriangle, Loader2, Share2, Twitter, Facebook, Linkedin, Copy, CheckCircle2, FileText, RefreshCw, TagIcon } from 'lucide-react';
import { saveAnalysisToHistory } from '@/actions/analysis';
import { useNotification } from '@/components/ui/common/notification-provider';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { formatAnalysisResult, extractCognitiveBiases, generateShareableSummary } from '@/utils/analysis-helpers';
import Spinner from "@/components/ui/common/spinner";

// Type for retry status
interface RetryStatus {
    count: number;
    lastAttempt: number;
}

export default function UploadForm() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userStatement, setUserStatement] = useState<string>('');
    const [isCopied, setIsCopied] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [retryStatus, setRetryStatus] = useState<RetryStatus>({ count: 0, lastAttempt: 0 });
    const [detectedBiases, setDetectedBiases] = useState<string[]>([]);
    const [shareableSummary, setShareableSummary] = useState<string>('');
    const resultRef = useRef<HTMLDivElement>(null);
    const { showNotification } = useNotification();
    
    // Effect to auto-scroll to results when analysis is complete
    useEffect(() => {
        if (analysisResult && !isAnalyzing && resultRef.current) {
            // Scroll to results with a slight delay to ensure the component is rendered
            const timer = setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
            
            return () => clearTimeout(timer);
        }
    }, [analysisResult, isAnalyzing]);
    
    // Reset the copy state after 2 seconds
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isCopied) {
            timer = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [isCopied]);
    
    // Handle retry logic with exponential backoff
    const handleRetry = async () => {
        // Prevent rapid retries - enforce at least 1 second between attempts
        const now = Date.now();
        if (now - retryStatus.lastAttempt < 1000) {
            showNotification('Please wait before retrying', 'info');
            return;
        }
        
        // Increment retry count and set last attempt time
        setRetryStatus(prev => ({
            count: prev.count + 1,
            lastAttempt: now
        }));
        
        // If we have a statement, retry the analysis
        if (userStatement) {
            await handleAnalysis(userStatement);
        }
    };
    
    // Extract the analysis logic to a separate function for reuse
    const handleAnalysis = async (statement: string) => {
        setIsAnalyzing(true);
        setError(null);
        
        try {
            console.log('Analyzing statement:', statement);
            
            // Track analytics event
            trackEvent('analyze_statement', 'user_action', `Statement Length: ${statement.length}`, retryStatus.count);
            
            let analysis = await generateAnalysisFromGemini(statement);
            
            // Format and process the analysis for consistent display
            analysis = formatAnalysisResult(analysis);
            
            // Extract cognitive biases for tagging and sharing
            const biases = extractCognitiveBiases(analysis);
            setDetectedBiases(biases);
            
            // Generate shareable text
            const summary = generateShareableSummary(statement, biases);
            setShareableSummary(summary);
            
            // Set the processed analysis result
            setAnalysisResult(analysis);
            
            // Save to history only if successful
            try {
                const result = await saveAnalysisToHistory({
                    statement: statement,
                    analysis: analysis,
                    createdAt: new Date(),
                });
                
                if (result.success) {
                    if (result.warning) {
                        // Show warning notification if there was an issue saving to history
                        showNotification(result.warning, 'info');
                    } else {
                        showNotification('Analysis saved to your history', 'success');
                    }
                }
            } catch (historyError) {
                console.error('Error saving analysis to history:', historyError);
                // Non-blocking error - the analysis will still be shown
                showNotification('Analysis completed but could not be saved to history', 'info');
            }
        } catch (error: any) {
            console.error('Error analyzing statement:', error);
            
            let errorMessage = 'Error analyzing your statement. Please try again.';
            let errorType = 'general';
            
            if (error.message === 'RATE_LIMIT_EXCEEDED') {
                errorMessage = 'Our AI service is currently busy. Please try again in a few minutes.';
                errorType = 'rate_limit';
            } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
                errorMessage = 'Network error. Please check your connection and try again.';
                errorType = 'network';
            } else if (error.message?.includes('content policy') || error.message?.includes('safety')) {
                errorMessage = 'Your statement could not be processed due to content policy restrictions.';
                errorType = 'content_policy';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            setAnalysisResult(null);
            
            // Track the error in analytics
            trackEvent('analysis_error', 'error', errorType, retryStatus.count);
            
            showNotification(errorMessage, 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = formData.get('statement') as string;
        
        // Reset previous results and errors
        setError(null);
        setShowShareOptions(false);
        
        if (!data || data.trim() === '') {
            setError('Please enter a statement to analyze');
            return;
        }
        
        // Reset retry counter when submitting a new statement
        setRetryStatus({ count: 0, lastAttempt: Date.now() });
        
        // Set the user statement
        setUserStatement(data);
        
        // Process the analysis
        await handleAnalysis(data);
    };
    
    return (
        <div className="w-full max-w-lg flex flex-col items-center gap-6">
           <UploadFormInput onSubmit={handleSubmit} isLoading={isAnalyzing} />
           
           {/* Loading state with improved visual */}
           {isAnalyzing && (
             <div className="mt-6 p-6 w-full border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black shadow-sm flex flex-col items-center justify-center">
               <Spinner size="lg" className="mb-4" />
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
             <div 
               ref={resultRef}
               className="mt-6 p-4 sm:p-6 w-full border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black shadow-lg overflow-auto max-w-full transition-all duration-300 ease-in-out"
             >
               {/* Header with title */}
               <div className="flex items-center justify-between mb-5">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-10 bg-gradient-to-b from-rose-500 to-slate-900 rounded-full shadow-md"></div>
                   <h3 className="text-xl font-semibold dark:text-white bg-gradient-to-r from-rose-700 to-slate-900 bg-clip-text text-transparent">Analysis Result</h3>
                 </div>
                 
                 {/* Action buttons */}
                 <div className="flex items-center gap-2">
                   <Button
                     onClick={handleRetry}
                     variant="outline"
                     size="sm"
                     className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300"
                     aria-label="Retry analysis"
                   >
                     <RefreshCw className="h-4 w-4 mr-1" />
                     Retry
                   </Button>
                   
                   <div className="relative">
                     <Button
                       onClick={() => setShowShareOptions(!showShareOptions)}
                       variant="outline"
                       size="sm"
                       className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300"
                       aria-label="Share analysis"
                       aria-expanded={showShareOptions}
                       aria-controls="share-options"
                     >
                       <Share2 className="h-4 w-4 mr-1" />
                       Share
                     </Button>
                     
                     {/* Share options popup */}
                     {showShareOptions && (
                       <div 
                         id="share-options"
                         className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-[200px] animate-fade-in"
                         style={{ minWidth: '200px' }}
                       >
                         <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Share via:</p>
                         <div className="grid grid-cols-1 gap-2">
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => {
                               window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareableSummary || `I analyzed my thinking with Cognovain and identified my cognitive biases! Check out this tool to improve your thinking: https://cognovain.vercel.app`)}`);
                               trackEvent('share', 'social', 'twitter');
                             }}
                             className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                           >
                             <Twitter className="h-4 w-4 mr-2" />
                             Twitter
                           </Button>
                           
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => {
                               window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://cognovain.vercel.app')}`)
                               trackEvent('share', 'social', 'facebook');
                             }}
                             className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-600"
                           >
                             <Facebook className="h-4 w-4 mr-2" />
                             Facebook
                           </Button>
                           
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => {
                               window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://cognovain.vercel.app')}`)
                               trackEvent('share', 'social', 'linkedin');
                             }}
                             className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-500"
                           >
                             <Linkedin className="h-4 w-4 mr-2" />
                             LinkedIn
                           </Button>
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
               
               {/* Original statement box */}
               <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-5 rounded-lg border border-gray-100 dark:border-gray-800 mb-6 shadow-inner animate-fade-in transition-all duration-300">
                 <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                   <FileText className="h-4 w-4" />
                   Original Statement
                 </h4>
                 <p className="text-gray-700 dark:text-gray-300 italic text-sm sm:text-base border-l-4 border-rose-300 dark:border-rose-700 pl-3 py-1 bg-rose-50/50 dark:bg-rose-950/20 rounded-r-sm">"{userStatement}"</p>
               </div>
               
               {/* Analysis content */}
               {/* Detected biases tags */}
               {detectedBiases.length > 0 && (
                 <div className="mb-4 flex flex-wrap gap-2 items-center">
                   <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                     <TagIcon className="h-3.5 w-3.5 mr-1" />
                     Detected patterns:
                   </span>
                   {detectedBiases.map((bias, index) => (
                     <span 
                       key={index}
                       className="px-2 py-1 text-xs font-medium rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                     >
                       {bias.replace(/^\w/, c => c.toUpperCase())}
                     </span>
                   ))}
                 </div>
               )}
                 
               <div className="prose max-w-none dark:prose-invert w-full overflow-hidden bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-inner transition-all duration-300">
                 {analysisResult.split('\n').map((paragraph, index) => {
                   // Enhanced highlighting for cognitive biases with more patterns
                   const highlightedText = paragraph.replace(
                      /(cognitive bias|logical fallacy|thinking error|cognitive distortion|black and white thinking|catastrophizing|overgeneralization|personalization|emotional reasoning|mental filter|jumping to conclusions|should statements|labeling|magnification|minimization|fortune telling|mind reading|disqualifying the positive|all-or-nothing thinking|filtering|polarized thinking|heaven's reward fallacy|control fallacy|fallacy of fairness|blaming|always being right|fallacy of change|global labeling|mislabeling|fallacy of attachment|discounting the positive|dichotomous thinking|arbitrary inference|selective abstraction|over-generalization|maximization|minimization|confirmation bias|hindsight bias|self-serving bias|attribution bias|framing effect|anchoring bias|availability heuristic|halo effect|fundamental attribution error|optimism bias|pessimism bias|dunning-kruger effect|actor-observer bias|sunk cost fallacy|false consensus effect|bandwagon effect|self-fulfilling prophecy|negativity bias|positive bias|recency bias|just world hypothesis|spotlight effect|gambler's fallacy|illusory correlation|projection bias|normalcy bias|reactance|regret aversion|status quo bias|outcome bias|moral luck|appeal to authority|appeal to emotion|appeal to ignorance|appeal to nature|appeal to novelty|appeal to tradition|appeal to hypocrisy|straw man fallacy|circular reasoning|ad hominem|slippery slope|false dilemma|hasty generalization|appeal to probability|appeal to force|bandwagon fallacy|no true scotsman|loaded question|ambiguity|perfect solution fallacy|thought-action fusion|emotional reasoning|compare and despair|cross-examination|excessive apologizing|overvaluing social approval|perfectionism|dismissal of positive|rejecting compliments|ignoring achievements|diminishing success|downplaying positives|disregarding strengths|refusal to accept praise|invalidating positive feedback|overlooking positive aspects|trivializing success|underestimating capabilities|refusing to acknowledge progress|denial of improvement|rejection of positive evidence|devaluing personal qualities|negating positive traits|discrediting positive experiences|diminishing personal worth|invalidating positive results|undermining accomplishments|discarding positive feedback|rejecting evidence of success|dismissing positive qualities|minimizing achievements|refusing recognition)/gi,
                      '<span class="font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-1 rounded shadow-sm">$1</span>'
                    );
                    
                    return (
                      <div 
                        key={index} 
                        className="mb-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base transition-opacity duration-300 ease-in break-words whitespace-pre-wrap overflow-wrap break-word"
                        dangerouslySetInnerHTML={{ __html: highlightedText }}
                      />
                    );
                  })}
                </div>
                
                {/* Action footer */}
               <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                 <p className="text-xs text-gray-500 dark:text-gray-400">
                   <span className="font-medium">Pro tip:</span> Save this analysis to your history for future reference.
                 </p>
                 
                 <Button 
                   onClick={() => {
                     navigator.clipboard.writeText(`Analysis of: "${userStatement}"

${analysisResult}`);
                     setIsCopied(true);
                     showNotification('Analysis copied to clipboard', 'success');
                     trackEvent('copy', 'user_action', 'analysis');
                   }}
                   variant="outline"
                   size="sm"
                   className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300"
                 >
                   {isCopied ? (
                     <>
                       <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                       Copied!
                     </>
                   ) : (
                     <>
                       <Copy className="h-4 w-4 mr-1" />
                       Copy to clipboard
                     </>
                   )}
                 </Button>
               </div>
             </div>
           )}
        </div>
    );
}