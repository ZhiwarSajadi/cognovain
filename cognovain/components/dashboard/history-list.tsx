'use client';

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp, Calendar, Clock, FileText, TagIcon, Copy, CheckCircle2 } from "lucide-react";
import { extractCognitiveBiases } from "@/utils/analysis-helpers";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

import Link from "next/link";

interface HistoryEntry {
  id: string;
  statement: string;
  analysis: string;
  createdAt: Date;
}

interface HistoryListProps {
  history: HistoryEntry[];
}

interface BiasesMap {
  [key: string]: string[];
}

interface CopiedStateMap {
  [key: string]: boolean;
}

export default function HistoryList({ history }: HistoryListProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [biasesMap, setBiasesMap] = useState<BiasesMap>({});
  const [copiedMap, setCopiedMap] = useState<CopiedStateMap>({});
  
  // Extract biases from analysis text when component mounts or history changes
  useEffect(() => {
    const newBiasesMap: BiasesMap = {};
    
    history.forEach(entry => {
      const biases = extractCognitiveBiases(entry.analysis);
      newBiasesMap[entry.id] = biases;
    });
    
    setBiasesMap(newBiasesMap);
  }, [history]);

  // Toggle expanded state for an item
  const toggleExpand = (id: string) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
  };

  // Handle copy to clipboard with visual feedback
  const handleCopy = (entry: HistoryEntry, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    navigator.clipboard.writeText(`Analysis of: "${entry.statement}"

${entry.analysis}`);
    
    // Update copied state for this entry
    setCopiedMap(prev => ({
      ...prev,
      [entry.id]: true
    }));
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedMap(prev => ({
        ...prev,
        [entry.id]: false
      }));
    }, 2000);
    
    // Show notification
    const notificationEvent = new CustomEvent('notification', { 
      detail: { message: 'Analysis copied to clipboard', type: 'success' } 
    });
    window.dispatchEvent(notificationEvent);
    
    // Track copy event
    trackEvent('copy', 'user_action', 'history_analysis');
  };

  // Function to highlight cognitive bias terms in text
  const highlightCognitiveBiases = (text: string) => {
    // Split text into paragraphs
    return text.split('\n').map((paragraph, index) => {
      // Replace cognitive bias terms with highlighted spans
      const highlightedText = paragraph.replace(
        /(cognitive bias|logical fallacy|thinking error|cognitive distortion|black and white thinking|catastrophizing|overgeneralization|personalization|emotional reasoning|mental filter|jumping to conclusions|should statements|labeling|magnification|minimization|fortune telling|mind reading|disqualifying the positive|all-or-nothing thinking|filtering|polarized thinking|heaven's reward fallacy|control fallacy|fallacy of fairness|blaming|always being right|fallacy of change|global labeling|mislabeling|fallacy of attachment|discounting the positive|dichotomous thinking|arbitrary inference|selective abstraction|over-generalization|maximization|minimization|confirmation bias|hindsight bias|self-serving bias|attribution bias|framing effect|anchoring bias|availability heuristic|halo effect|fundamental attribution error|optimism bias|pessimism bias|dunning-kruger effect|actor-observer bias|sunk cost fallacy|false consensus effect|bandwagon effect|self-fulfilling prophecy|negativity bias|positive bias|recency bias|just world hypothesis|spotlight effect|gambler's fallacy|illusory correlation|projection bias|normalcy bias|reactance|regret aversion|status quo bias|outcome bias|moral luck|appeal to authority|appeal to emotion|appeal to ignorance|appeal to nature|appeal to novelty|appeal to tradition|appeal to hypocrisy|straw man fallacy|circular reasoning|ad hominem|slippery slope|false dilemma|hasty generalization|appeal to probability|appeal to force|bandwagon fallacy|no true scotsman|loaded question|ambiguity|perfect solution fallacy|thought-action fusion|emotional reasoning|compare and despair|cross-examination|excessive apologizing|overvaluing social approval|perfectionism|dismissal of positive|rejecting compliments|ignoring achievements|diminishing success|downplaying positives|disregarding strengths|refusal to accept praise|invalidating positive feedback|overlooking positive aspects|trivializing success|underestimating capabilities|refusing to acknowledge progress|denial of improvement|rejection of positive evidence|devaluing personal qualities|negating positive traits|discrediting positive experiences|diminishing personal worth|invalidating positive results|undermining accomplishments|discarding positive feedback|rejecting evidence of success|dismissing positive qualities|minimizing achievements|refusing recognition)/gi,
        '<span class="font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-1 rounded shadow-sm">$1</span>'
      );
      
      return (
        <div 
          key={index} 
          className="mb-4 text-gray-700 dark:text-gray-300 transition-all duration-300"
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
      );
    });
  };

  if (history.length === 0) {
    return (
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <div className="flex flex-col items-center">
          <FileText className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">No Analysis History</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't analyzed any statements yet. Try submitting a statement for analysis!
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-slate-900 to-rose-500 hover:from-rose-500 hover:to-slate-900 transition-all duration-300"
          >
            Analyze a Statement
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="space-y-4">
        {history.map((entry) => {
          const entryId = entry.id;
          const isExpanded = expandedItem === entryId;
          
          return (
            <div
              key={entryId}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:shadow-md hover:border-rose-200 dark:hover:border-rose-800"
            >
              <div
                className="p-4 sm:p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                onClick={() => toggleExpand(entryId)}
              >
                <div className="mr-4 flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1 sm:text-lg">
                    {entry.statement}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-3 sm:gap-4">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                    </span>
                    {biasesMap[entryId] && biasesMap[entryId].length > 0 && (
                      <span className="flex items-center">
                        <TagIcon className="h-4 w-4 mr-1" />
                        {biasesMap[entryId].length} pattern{biasesMap[entryId].length !== 1 ? 's' : ''} detected
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 animate-fade-in transition-all duration-300">
                  <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-5 bg-rose-500 rounded-full"></div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300">Original Statement</h4>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic border-l-4 border-gray-200 dark:border-gray-600 pl-3 py-1">"{entry.statement}"</p>
                  </div>
                  {/* Detected biases/patterns */}
                  {biasesMap[entryId] && biasesMap[entryId].length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2 items-center">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <TagIcon className="h-3.5 w-3.5 mr-1" />
                        Detected patterns:
                      </span>
                      {biasesMap[entryId].slice(0, 5).map((bias, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                        >
                          {bias.replace(/^\w/, c => c.toUpperCase())}
                        </span>
                      ))}
                      {biasesMap[entryId].length > 5 && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                          +{biasesMap[entryId].length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-gradient-to-b from-rose-500 to-slate-900 rounded-full shadow-sm"></div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300 bg-gradient-to-r from-rose-500 to-slate-900 bg-clip-text text-transparent">Analysis</h4>
                    </div>
                    <div className="prose max-w-none bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600 shadow-md transition-all duration-300 overflow-auto" style={{ maxHeight: '800px' }}>
                      {highlightCognitiveBiases(entry.analysis)}
                    </div>
                    
                    <div className="flex justify-end items-center mt-6">
                      {/* Copy button */}
                      <Button 
                        onClick={(e) => handleCopy(entry, e)}
                        variant="outline"
                        size="sm"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300"
                      >
                        {copiedMap[entry.id] ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}