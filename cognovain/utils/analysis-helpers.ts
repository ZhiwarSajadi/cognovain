/**
 * Utility functions for handling cognitive analysis results
 */

/**
 * Process and format raw analysis text for improved display
 * This helps with consistent formatting regardless of AI response variations
 */
export function formatAnalysisResult(rawText: string): string {
  // Remove any extra whitespace
  let processedText = rawText.trim();
  
  // Ensure each line starts with a bullet point if it doesn't already
  const lines = processedText.split('\n');
  const formattedLines = lines.map(line => {
    // Skip empty lines
    if (!line.trim()) return line;
    
    // If line already has a bullet point format (• ), leave it as is
    if (line.trim().match(/^•\s+.+/)) return line;
    
    // If line starts with "Analysis:" or "Reframed Statement:", keep as heading
    if (line.trim().match(/^(Analysis|Reframed Statement):$/i)) return line;
    
    // Otherwise, add a bullet point with an appropriate emoji if not already present
    if (!line.trim().match(/^[•\-\*]\s+.+/)) {
      // Select emoji based on context
      let emoji = '💡'; // Default
      
      if (line.toLowerCase().includes('bias') || 
          line.toLowerCase().includes('distortion') || 
          line.toLowerCase().includes('error') || 
          line.toLowerCase().includes('fallacy')) {
        emoji = '🧠';
      } else if (line.toLowerCase().includes('reframed') || 
                line.toLowerCase().includes('alternative') || 
                line.toLowerCase().includes('instead')) {
        emoji = '✅';
      } else if (line.toLowerCase().includes('emotion') || 
                line.toLowerCase().includes('feel')) {
        emoji = '😊';
      }
      
      return `• ${emoji} ${line.trim()}`;
    }
    
    return line;
  });
  
  return formattedLines.join('\n');
}

/**
 * Extract main cognitive biases from analysis text
 * Useful for summarizing or tagging analysis results
 */
export function extractCognitiveBiases(analysisText: string): string[] {
  const biasPatterns = [
    /cognitive bias/gi,
    /logical fallacy/gi,
    /thinking error/gi,
    /cognitive distortion/gi,
    /black and white thinking/gi,
    /catastrophizing/gi,
    /overgeneralization/gi,
    /personalization/gi,
    /emotional reasoning/gi,
    /mental filter/gi,
    /jumping to conclusions/gi,
    /should statements/gi,
    /labeling/gi,
    /magnification/gi,
    /minimization/gi,
    /fortune telling/gi,
    /mind reading/gi,
    /disqualifying the positive/gi,
    /all-or-nothing thinking/gi,
    /filtering/gi,
    /polarized thinking/gi
  ];
  
  const biases = new Set<string>();
  
  // For each pattern, find all matches in the text
  biasPatterns.forEach(pattern => {
    const matches = analysisText.match(pattern);
    if (matches) {
      matches.forEach(match => biases.add(match.toLowerCase()));
    }
  });
  
  return Array.from(biases);
}

/**
 * Generate a shareable summary text from analysis
 */
export function generateShareableSummary(statement: string, biases: string[]): string {
  if (biases.length === 0) {
    return `I used Cognovain to analyze my thinking patterns! Check it out at cognovain.vercel.app`;
  }
  
  const biasText = biases.length === 1 
    ? `identified the ${biases[0]} in my thinking` 
    : `identified cognitive patterns like ${biases.slice(0, 2).join(' and ')} in my thinking`;
  
  return `I used Cognovain and ${biasText}! Improve your thinking at cognovain.vercel.app`;
}
