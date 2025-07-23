"use client";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const FAQItem = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-700/50 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <h4 className="text-lg font-semibold text-white">{question}</h4>
        <FiChevronDown
          className={`h-6 w-6 text-indigo-400 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pt-4 text-slate-400 leading-relaxed">{children}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
