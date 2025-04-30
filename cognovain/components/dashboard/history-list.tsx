'use client';

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp, Calendar, Clock, FileText } from "lucide-react";
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

export default function HistoryList({ history }: HistoryListProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Toggle expanded state for an item
  const toggleExpand = (id: string) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
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
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-gradient-to-b from-rose-500 to-slate-900 rounded-full shadow-sm"></div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300 bg-gradient-to-r from-rose-500 to-slate-900 bg-clip-text text-transparent">Analysis</h4>
                    </div>
                    <div className="prose max-w-none bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600 shadow-md transition-all duration-300 overflow-auto" style={{ maxHeight: '800px' }}>
                      {highlightCognitiveBiases(entry.analysis)}
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`Analysis of: "${entry.statement}"\n\n${entry.analysis}`);
                          // Show a copy notification if available
                          const event = new CustomEvent('notification', { 
                            detail: { message: 'Analysis copied to clipboard', type: 'success' } 
                          });
                          window.dispatchEvent(event);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy
                      </button>
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