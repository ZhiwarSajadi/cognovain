import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default function DemoSection() {
    return (
        <section className="relative mx-auto flex flex-col z-0 items-center justify-center min-h-[60vh] py-24 transition-all animate-in lg:px-12 max-w-7xl">
            <div className="flex flex-col items-center justify-center w-full px-4 gap-12">
                <div className="text-center space-y-6">
                    <h2 className="text-4xl lg:text-5xl font-bold">
                        Reframe Your <span className="text-rose-600">Statements</span> into
                        <br />
                        Error-free <span className="text-rose-600">Insights</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Enter your Statement and let our AI analyze cognitive patterns, providing you with clear, correct insights.
                    </p>
                </div>
            </div>
        </section>
    );
}