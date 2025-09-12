'use client';

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { handleError } from "@/lib/utils";

export default function TestLocalization() {
  const { t, i18n } = useTranslation();

  const showSuccessToast = () => {
    toast.success(t('toast.success.passwordChanged'));
  };

  const showErrorToast = () => {
    toast.error(t('toast.error.passwordChangeFailed'));
  };

  const showErrorWithHandler = () => {
    // Simulate an error
    const mockError = {
      response: {
        status: 500,
        data: {}
      }
    };
    toast.error(handleError(mockError, t));
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">{t('common.loading')}</h1>
      
      <div className="space-y-4">
        <Button onClick={toggleLanguage} className="w-full">
          {i18n.language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={showSuccessToast} variant="default">
            {t('common.success')}
          </Button>
          
          <Button onClick={showErrorToast} variant="destructive">
            {t('common.error')}
          </Button>
          
          <Button onClick={showErrorWithHandler} variant="outline">
            {t('errors.serverError')}
          </Button>
        </div>
      </div>
    </div>
  );
}