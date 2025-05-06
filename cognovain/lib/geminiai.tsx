'use client';

// We'll use a server action to handle the API call since environment variables
// that don't start with NEXT_PUBLIC_ are only available on the server

// Function to generate analysis from Gemini AI using server-side API
export const generateAnalysisFromGemini = async (userText: string) => {
  try {
    // Call the server-side API endpoint
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userText }),
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 429) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      throw new Error(errorData.error || 'Failed to generate analysis');
    }

    // Parse the response
    const data = await response.json();
    
    // Return the analysis without logging to console in production code
    
    return data.analysis;
  } catch (error: any) {
    // Handle errors without logging to console in production code
    throw error;
  }
};