# Cognovain - The Cognitive Platform

Cognovain is a web application designed to help users identify cognitive errors in their thinking patterns and reframe them into more accurate, balanced thoughts. Using AI-powered analysis, Cognovain provides insights into cognitive biases and offers constructive alternatives.

## Features

- **AI-Powered Analysis**: Leverages Google's Gemini 2.0 API for state-of-the-art cognitive error detection
- **User Authentication**: Secure login and user management using Clerk
- **Analysis History**: Track and review past analyses to identify recurring patterns
- **Cloud Database**: Secure storage of analysis history in Supabase PostgreSQL database
- **Responsive Design**: Optimized for all devices including mobile, tablet, and desktop
- **Accessibility**: WCAG-compliant with screen reader support and keyboard navigation
- **Analytics**: Track user behavior and engagement with Google Analytics integration

## Environment Setup

1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and fill in the required values:
   - Clerk authentication keys (sign up at [clerk.dev](https://clerk.dev))
   - Gemini API key (get from [Google AI Studio](https://ai.google.dev/))
   - Supabase URL and keys (get from your Supabase project):
  - `SUPABASE_URL`: Your Supabase project URL
  - `SUPABASE_SERVICE_ROLE_KEY`: Service role key (used only for admin operations)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon/public key (used for operations that respect RLS)
   - Google Analytics ID (optional)
3. Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

## Supabase Database Setup

1. Create a Supabase account at [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to the SQL Editor and run the following SQL to create the analysis history table:

```sql
CREATE TABLE analysis_history (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  statement TEXT NOT NULL,
  analysis TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create a policy that allows users to only see their own data
CREATE POLICY "Users can only see their own analysis history" 
  ON analysis_history 
  FOR SELECT 
  USING (auth.uid()::text = user_id);

-- Create a policy that allows users to insert their own data
CREATE POLICY "Users can only insert their own analysis history" 
  ON analysis_history 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);
```

4. From your Supabase project dashboard, get the following values and add them to your `.env.local` file:
   - Project URL (`SUPABASE_URL`)
   - API Keys > anon public (`SUPABASE_ANON_KEY`)  
   - API Keys > service_role secret (`SUPABASE_SERVICE_ROLE_KEY`)
   - Connection Pooling > Connection string (`DATABASE_URL`) - Use Transaction pooler for better performance

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Code Structure

- `/app` - Next.js App Router pages and layouts
- `/components` - React components organized by feature
- `/lib` - Utility functions and shared logic
- `/actions` - Server actions for data operations
- `/utils` - Helper functions and constants
- `/public` - Static assets

## Technologies Used

- **Framework**: Next.js 14 with App Router
- **UI**: React, Tailwind CSS
- **Authentication**: Clerk
- **AI**: Google Gemini AI
- **Database**: Supabase (PostgreSQL)
- **Analytics**: Google Analytics
- **Deployment**: Vercel (recommended)

## License

[MIT](LICENSE)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Clerk account for authentication
- Google Gemini API key
- Supabase account and project

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/cognovain.git
   cd cognovain
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

Cognovain uses Supabase for data storage. You'll need to create the following tables in your Supabase project:

### Analysis History Table

```sql
CREATE TABLE analysis_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  original_text TEXT NOT NULL,
  analysis_result TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX idx_analysis_history_created_at ON analysis_history(created_at);
```

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure the environment variables in Vercel's dashboard
4. Deploy the application

### Environment Variables in Vercel

Make sure to add all the environment variables from your `.env.local` file to your Vercel project settings.

## Project Structure

```
/app                  # Next.js app directory
  /(logged-in)        # Protected routes requiring authentication
  /api                # API routes
  /auth-callback      # Authentication callback handling
  /sign-in            # Sign in page
  /sign-up            # Sign up page
/components           # React components
  /auth               # Authentication components
  /dashboard          # Dashboard components
  /home               # Home page components
  /ui                 # UI components
  /upload             # Upload form components
/lib                  # Utility libraries
/public               # Static assets
/utils                # Utility functions
```

## Error Handling

The application includes several error handling mechanisms:

- **ErrorBoundary**: Catches and displays React component errors
- **ApiErrorHandler**: Handles API errors consistently
- **Notification System**: Provides user feedback for errors and successes

## Performance Optimization

- **Image Optimization**: Uses Next.js Image component for optimized image loading
- **Code Splitting**: Automatic code splitting with Next.js
- **API Route Optimization**: Implements caching strategies for Supabase queries

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for providing the cognitive analysis capabilities
- Clerk for authentication services
- Supabase for database services
- Vercel for hosting and deployment
