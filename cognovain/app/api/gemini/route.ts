import { GoogleGenerativeAI } from '@google/generative-ai';
import { ANALYSIS_SYSTEM_PROMPT } from '@/utils/prompts';
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

// Mark this route as dynamically rendered
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Check if API key is available
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not defined in environment variables');
}

// Initialize the Google Generative AI with the API key from environment variables
// This code runs on the server, so it can safely access the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Maximum number of retry attempts
const MAX_RETRIES = 3;
// Delay between retries in milliseconds
const RETRY_DELAY = 1000;

// Helper function to wait for a specified delay
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple in-memory rate limiting (should be replaced with Redis in production)
type RateLimitEntry = { count: number; timestamp: number };
const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const RATE_LIMIT_MAX = 5; // 5 requests per minute

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY'
          }
        }
      );
    }
    
    // Implement rate limiting
    const userId = user.id;
    const now = Date.now();
    const userRateLimit = rateLimitMap.get(userId);
    
    if (userRateLimit) {
      // Check if we're still in the rate limit window
      if (now - userRateLimit.timestamp < RATE_LIMIT_WINDOW) {
        // User has made requests in the current window
        if (userRateLimit.count >= RATE_LIMIT_MAX) {
          // User has exceeded rate limit
          return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            { 
              status: 429,
              headers: {
                'Content-Type': 'application/json',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'Retry-After': '60'
              }
            }
          );
        }
        // Increment the request count
        userRateLimit.count++;
      } else {
        // Window has expired, reset the counter
        rateLimitMap.set(userId, { count: 1, timestamp: now });
      }
    } else {
      // First request from this user
      rateLimitMap.set(userId, { count: 1, timestamp: now });
    }
    
    // Parse the request body to get the user text
    const { userText } = await request.json();
    
    if (!userText) {
      return NextResponse.json(
        { error: 'User text is required' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY'
          }
        }
      );
    }

    // Sanitize input - remove any potentially harmful characters
    const sanitizedText = userText.trim().slice(0, 2000); // Limit input length

    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-001',
    });

    // Create the prompt with system prompt and user input
    const prompt = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: ANALYSIS_SYSTEM_PROMPT },
            {
              text: `Analyze this statement for cognitive errors and provide a reframed version that corrects those errors (The analysis must be engaging, easy-to-read analysis with contextually relevant emojis and proper markdown formatting):\n\n${sanitizedText}`,
            },
          ],
        },
      ],
    };

    // Implement retry logic for API calls
    let lastError: any = null;
    
    // Retry the API call if it fails
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        // Return successful response with security headers
        return NextResponse.json(
          { analysis: text },
          { 
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'X-Content-Type-Options': 'nosniff',
              'X-Frame-Options': 'DENY',
              'Cache-Control': 'no-store, max-age=0'
            }
          }
        );
      } catch (error: any) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        lastError = error;
        
        // Check if we've reached the rate limit
        if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
          return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            { 
              status: 429,
              headers: {
                'Content-Type': 'application/json',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'Retry-After': '60'
              }
            }
          );
        }
        
        // Wait before retrying
        if (attempt < MAX_RETRIES - 1) {
          await wait(RETRY_DELAY * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }
    
    // If all retries fail, return an error
    return NextResponse.json(
      { error: `Failed after ${MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}` },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY'
        }
      }
    );
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    // Handle more specific error cases
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a few minutes.' },
        { status: 429 }
      );
    } else if (error?.status === 403) {
      return NextResponse.json(
        { error: 'Unable to access the AI service. The API key may be invalid or restricted.' },
        { status: 403 }
      );
    } else if (error?.status === 400) {
      return NextResponse.json(
        { error: 'Your statement could not be processed. Please try rephrasing it.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while generating analysis' },
      { status: 500 }
    );
  }
}