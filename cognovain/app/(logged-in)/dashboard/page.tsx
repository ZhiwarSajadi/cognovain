import BgGradient from "@/components/ui/common/bg-gradient";
import { getAnalysisHistory } from "@/actions/analysis";
import HistoryList from "@/components/dashboard/history-list";

// Mark this route as dynamically rendered to handle headers() usage
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function DashboardPage() {
  // Fetch the user's ID for history access
  const historyData = await getAnalysisHistory();
  
  return (
    <section className="min-h-screen">
      <BgGradient />
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Your Analysis History</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              View your past statements and their cognitive analysis results. This helps you track progress and identify recurring patterns in your thinking.
            </p>
          </div>
          
          <HistoryList history={historyData} />
        </div>
      </div>
    </section>
  );
}