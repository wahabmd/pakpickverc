import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, DollarSign, Target, Star } from 'lucide-react';

interface SurveyStep {
    id: number;
    question: string;
    description: string;
    options: { label: string; value: string; icon: React.ReactNode }[];
}

const STEPS: SurveyStep[] = [
    {
        id: 1,
        question: "What is your investment budget?",
        description: "This helps us filter products within your purchasing power.",
        options: [
            { label: "Low (PKR 10k - 50k)", value: "low", icon: <DollarSign className="w-5 h-5" /> },
            { label: "Medium (PKR 50k - 200k)", value: "medium", icon: <><DollarSign className="w-5 h-5" /><DollarSign className="w-5 h-5" /></> },
            { label: "High (PKR 200k+)", value: "high", icon: <Target className="w-5 h-5" /> },
        ]
    },
    {
        id: 2,
        question: "Which category interests you most?",
        description: "Focus on a niche to build a stronger brand.",
        options: [
            { label: "Electronics", value: "electronics", icon: <Star className="w-5 h-5" /> },
            { label: "Home & Kitchen", value: "home", icon: <Star className="w-5 h-5" /> },
            { label: "Fashion & Lifestyle", value: "fashion", icon: <Star className="w-5 h-5" /> },
        ]
    },
    {
        id: 3,
        question: "What is your risk appetite?",
        description: "High risk often means higher competition but bigger rewards.",
        options: [
            { label: "Conservative", value: "low_risk", icon: <CheckCircle2 className="w-5 h-5" /> },
            { label: "Balanced", value: "med_risk", icon: <CheckCircle2 className="w-5 h-5" /> },
            { label: "Aggressive", value: "high_risk", icon: <CheckCircle2 className="w-5 h-5" /> },
        ]
    }
];

const SurveyFlow = ({ onComplete }: { onComplete: (answers: any) => void }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const handleSelect = (value: string) => {
        const newAnswers = { ...answers, [currentStep]: value };
        setAnswers(newAnswers);
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete(newAnswers);
        }
    };

    const step = STEPS[currentStep];
    const progress = ((currentStep + 1) / STEPS.length) * 100;

    return (
        <div className="max-w-2xl mx-auto pt-12">
            <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Step {currentStep + 1} of {STEPS.length}
                    </span>
                    <span className="text-xs font-bold text-blue-400">{Math.round(progress)}% Complete</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card p-10"
                >
                    <h2 className="text-3xl font-bold mb-2">{step.question}</h2>
                    <p className="text-slate-400 mb-8">{step.description}</p>

                    <div className="space-y-4">
                        {step.options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className="w-full flex items-center p-6 btn-secondary border border-transparent rounded-2xl hover:border-blue-500 hover:bg-blue-500/10 transition-all text-left group mb-3 shadow-sm"
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-300/30 dark:bg-slate-800 flex items-center justify-center mr-4 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors text-slate-700 dark:text-slate-400">
                                    {option.icon}
                                </div>
                                <span className="text-lg font-semibold">{option.label}</span>
                                <ChevronRight className="ml-auto w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                            </button>
                        ))}
                    </div>

                    {currentStep > 0 && (
                        <button
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="mt-8 flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-medium"
                        >
                            <ChevronLeft className="mr-1 w-4 h-4" /> Previous Step
                        </button>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default SurveyFlow;
