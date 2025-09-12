import axios from "axios"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "scheduled":
      return "bg-blue-100 text-blue-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getDayName = (dayIndex: number, t?: any) => {
  if (t) {
    return t(`common.days.${dayIndex}`)
  }
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[dayIndex]
}

// Localized date formatter. Default to en-GB to preserve existing behavior when lang not provided.
export const formatDate = (dateString: Date, lang: string = "en-GB") => {
  return new Date(dateString).toLocaleDateString(lang, {
    year: "numeric",
    weekday: "long",
    month: "numeric",
    day: "numeric",
    timeZone: "UTC",
  })
}

export function handleError(error: unknown, t?: any): string {
  // If translation function is not provided, use default messages
  const defaultT = (key: string) => {
    const errorMessages: Record<string, string> = {
      'errors.serverDown': 'Server is down Please try again later',
      'errors.networkError': 'Network error: Please check your internet connection.',
      'errors.serverError': 'Server is down, Please try again later.',
      'errors.notFound': 'Not Found Error.',
      'errors.unexpectedError': 'An unexpected error occurred.',
      'errors.genericError': 'Something went wrong.'
    };
    return errorMessages[key] || key;
  };

  // Use provided translation function or fallback to default
  const translate = t || defaultT;

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return navigator.onLine ? translate('errors.serverDown') :
        translate('errors.networkError');
    }

    const status = error.response.status;
    const data = error.response.data;
    if (status === 500) {
      return translate('errors.serverError');
    } else if (status === 404) {
      return translate('errors.notFound');
    }
    else if (data && typeof data === 'object') {
      // Prefer Arabic server message when current language is Arabic and messageAr exists
      const currentLang = t?.i18n?.language;
      if (currentLang === 'ar' && 'messageAr' in data && typeof (data as any).messageAr === 'string') {
        return (data as any).messageAr as string;
      }
      if ('message' in data) {
        console.log(data);
        return (data as any).message as string; // Keep original API message
      }
    }

    return translate('errors.unexpectedError');
  } else if (error instanceof Error) {
    return error.message;
  }

  return translate('errors.genericError');
}