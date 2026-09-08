import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqsList = [
  {
    question: "What is HealthifyMe?",
    answer:
      "HealthifyMe is an AI-powered symptom checker that provides preliminary health analysis based on the symptoms you provide. It is for informational purposes only and is not a substitute for professional medical advice.",
  },
  {
    question: "Is the analysis a medical diagnosis?",
    answer:
      "No. The information provided by HealthifyMe is not a medical diagnosis. It is intended for educational and awareness purposes only. You should always consult with a qualified healthcare professional for any health concerns or before making any decisions related to your health.",
  },
  {
    question: "How accurate is the AI?",
    answer:
      "Our AI is trained on a vast amount of medical data to provide likely conditions based on your symptoms. However, it cannot replace the expertise and judgment of a human doctor who can perform a physical examination and consider your full medical history.",
  },
  {
    question: "What should I do if I have a medical emergency?",
    answer:
      "If you are experiencing a medical emergency, please call your local emergency services immediately or go to the nearest hospital. Do not rely on this tool for emergency situations.",
  },
  {
    question: "Is my data safe?",
    answer:
      "We take your privacy seriously. Your data is processed securely, and all analyses are performed anonymously."
  }
];

export function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full space-y-4">
      {faqsList.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border border-border rounded-lg bg-card overflow-hidden transition-all shadow-sm">
            <button
              type="button"
              onClick={() => toggleIndex(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-lg text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <span>{faq.question}</span>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'transform rotate-180 text-primary' : ''}`} />
            </button>
            {isOpen && (
              <div className="px-6 pb-4 text-base text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
