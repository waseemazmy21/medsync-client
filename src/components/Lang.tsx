"use client";

import { Button } from "./ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function LocaleSwitcher() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
  };

  return (
    <Button 
      onClick={toggleLanguage}
      variant="outline" 
      size="sm"
      className="flex gap-2 items-center"
    >
      <Globe className="h-4 w-4" />
      {language === 'en' ? 'العربية' : 'English'}
    </Button>
  );
}
