import { Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function UploadHeader() {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="relative p-[2px] overflow-hidden rounded-full bg-gradient-to-r from-rose-200 via-rose-500 to-rose-800 mb-6">
                <Badge variant={'secondary'} className="relative px-8 py-3 text-lg font-medium bg-white dark:bg-gray-800 rounded-full">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                        <p className="text-rose-600 dark:text-rose-400 text-lg">Powered by AI</p>
                    </div>
                </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl mb-4">Start entering your statement</h1>    
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">Enter your statement and let our AI do the analysis</p>
        </div>
    )
}