"use client";
import { ComponentProps, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmailStep from "./EmailStep";
import VerifyStep from "./VerifyStep";
import PasswordStep from "./PasswordStep";

export default function ResetPasswordModal({ onClose }:ComponentProps) {
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, title: "Email" },
    { id: 2, title: "Verify" },
    { id: 3, title: "Password" },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-blue-50 to-green-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
      >
        {/* 🔹 Step Progress Bar */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((s, index) => (
            <div key={s.id} className="flex-1 flex items-center">
              {/* الدائرة */}
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  step >= s.id
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-500 border-gray-300"
                }`}
              >
                {s.id}
              </div>

              {/* الخط الفاصل */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-[2px] ${
                    step > s.id ? "bg-black" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* العنوان */}
        <h2 className="text-xl font-bold mb-4 text-center">
          {steps.find((s) => s.id === step)?.title}
        </h2>

        {/* 🔹 الخطوات مع الأنيميشن */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <EmailStep onNext={() => setStep(2)} onClose={onClose}/>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="verify-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <VerifyStep onNext={() => setStep(3)} onBack = {()=> setStep(1)} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="password-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <PasswordStep onClose={onClose} onBack = {()=> setStep(1)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* زر الإلغاء */}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}
