'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: "What is Cognovain?",
    answer: "Cognovain is an AI-powered cognitive platform that helps analyze and correct cognitive errors in statements. It uses advanced AI to identify logical fallacies, biases, and other cognitive distortions in your thinking."
  },
  {
    question: "How does Cognovain work?",
    answer: "Submit any statement or thought, and our AI will analyze it for cognitive distortions, logical fallacies, and biases. The platform then provides feedback on how to reframe your thinking more accurately and constructively."
  },
  {
    question: "Do I need to create an account to use Cognovain?",
    answer: "Yes, you need to create an account to submit entries for analysis. We offer a free basic plan with limited monthly entries, as well as premium plans for more frequent users."
  },
  {
    question: "Is my data kept private?",
    answer: "Yes, we take privacy seriously. Your submitted statements and analyses are kept confidential and are only accessible to you through your account."
  },
  {
    question: "What kind of statements can I submit?",
    answer: "You can submit any text-based statement or thought you'd like analyzed for cognitive errors. This could include personal beliefs, opinions, arguments, or any thinking pattern you want to examine."
  },
  {
    question: "How accurate is the analysis?",
    answer: "Cognovain uses state-of-the-art AI models trained on cognitive psychology principles. While the analysis is highly sophisticated, it should be considered a tool for reflection rather than definitive psychological advice."
  }
];

export default function FaqSection() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">Find answers to common questions about Cognovain and how it can help improve your thinking.</p>
      </div>
      
      <div className="max-w-3xl mx-auto space-y-6">
        {faqItems.map((item, index) => (
          <div 
            key={index} 
            className={`relative p-[2px] overflow-hidden rounded-xl ${openItem === index 
              ? 'bg-gradient-to-r from-rose-300 via-rose-500 to-rose-700 shadow-lg' 
              : 'bg-gradient-to-r from-rose-200 via-rose-400 to-rose-600 shadow-sm hover:shadow-md transition-shadow duration-300'
            }`}
          >
            <div className="bg-white rounded-[calc(0.75rem-1px)]">
              <button
                onClick={() => toggleItem(index)}
                className="flex justify-between items-center w-full text-left px-6 py-5"
                aria-expanded={openItem === index}
                aria-controls={`faq-answer-${index}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-1.5 ${openItem === index ? 'bg-rose-100' : 'bg-gray-50'}`}>
                    <Sparkles className={`w-4 h-4 ${openItem === index ? 'text-rose-600' : 'text-rose-500'}`} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                </div>
                <motion.span
                  animate={{ rotate: openItem === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`flex items-center justify-center h-7 w-7 rounded-full ${
                    openItem === index ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.span>
              </button>
              
              <AnimatePresence>
                {openItem === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-2 text-base text-gray-600 border-t border-gray-100">
                      <p>{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 