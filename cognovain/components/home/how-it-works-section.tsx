import { FileText, Brain, FileOutput } from 'lucide-react';

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="relative mx-auto flex flex-col z-0 items-center justify-center min-h-[80vh] py-32 sm:py-40 lg:py-48 transition-all animate-in lg:px-12 max-w-7xl">
            <div className="flex flex-col items-center justify-center w-full px-4"> 
                <p className="text-rose-600 font-medium mb-4">HOW IT WORKS</p>
                <h2 className="text-3xl lg:text-4xl font-bold mb-16 text-center max-w-3xl">Reframe any Statement into correct insights in three simple steps</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full max-w-5xl relative">
                    {/* Hidden on mobile, visible on md and up */}
                    <div className="hidden md:block absolute top-[30%] left-[30%] transform -translate-x-1/2">
                        <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M39.0607 13.0607C39.6464 12.4749 39.6464 11.5251 39.0607 10.9393L29.5147 1.39339C28.9289 0.807609 27.9792 0.807609 27.3934 1.39339C26.8076 1.97917 26.8076 2.92892 27.3934 3.51471L35.8787 12L27.3934 20.4853C26.8076 21.0711 26.8076 22.0208 27.3934 22.6066C27.9792 23.1924 28.9289 23.1924 29.5147 22.6066L39.0607 13.0607ZM0 13.5H38V10.5H0V13.5Z" fill="#E11D48"/>
                        </svg>
                    </div>
                    <div className="hidden md:block absolute top-[30%] left-[63%] transform -translate-x-1/2">
                        <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M39.0607 13.0607C39.6464 12.4749 39.6464 11.5251 39.0607 10.9393L29.5147 1.39339C28.9289 0.807609 27.9792 0.807609 27.3934 1.39339C26.8076 1.97917 26.8076 2.92892 27.3934 3.51471L35.8787 12L27.3934 20.4853C26.8076 21.0711 26.8076 22.0208 27.3934 22.6066C27.9792 23.1924 28.9289 23.1924 29.5147 22.6066L39.0607 13.0607ZM0 13.5H38V10.5H0V13.5Z" fill="#E11D48"/>
                        </svg>
                    </div>
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-rose-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Enter your Statement</h3>
                        <p className="text-gray-600">Simply type or paste your statement</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                            <Brain className="w-8 h-8 text-rose-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                        <p className="text-gray-600">Our advanced AI processes and analyzes your entry instantly</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                            <FileOutput className="w-8 h-8 text-rose-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Get results</h3>
                        <p className="text-gray-600">Receive a clear, correct result of your entry</p>
                    </div>
                </div>
            </div>
        </section>
    );
}