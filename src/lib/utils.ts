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

export const getDayName = (dayIndex: number) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[dayIndex]
}

export const formatDate = (dateString: Date) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    weekday: "long",
    month: "numeric",
    day: "numeric",
    timeZone: "UTC"
  })
}

export function handleError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return navigator.onLine ? "Server is down Please try again later" :
        'Network error: Please check your internet connection.'
    }

    const status = error.response.status
    const data = error.response.data
    if (status === 500) {
      return 'Server is down, Please try again later.'
    } else if (status === 404) {
      return 'Not Found Error.'
    }
    else if (data && typeof data === 'object' && 'message' in data) {
      console.log(data)
      return data.message;
    }

    return 'An unexpected error occurred.'
  } else if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong.'
}