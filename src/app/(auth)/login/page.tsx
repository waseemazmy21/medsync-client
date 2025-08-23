"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import Logo from "@/components/Logo";
import Link from "next/link";
import ResetPasswordModal from "@/components/ResetPasswordModal";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      setServerError(null);
      await login(data);
      router.push("/dashboard");
    } catch {
      setServerError("Invalid email or password.");
    }
  };

  const onError = (error: any) => {
    console.log(error);
  };

  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center 
      bg-gradient-to-b from-blue-50 to-green-50  
      dark:from-gray-900 dark:to-gray-800">

      <Logo />

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-center mb-1 dark:text-white">Welcome Back</h3>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-4">Sign in to your account</p>
        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

        <form method="POST" onSubmit={handleSubmit(onSubmit, onError)} className="space-y-3">
          {/* Email */}
          <div className="relative">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
              })}
              placeholder="Enter your email"
              className="w-full border rounded p-2 pl-8 bg-gray-50 dark:bg-gray-600 dark:text-white"
            />
            <Mail className="absolute left-2 top-10 w-4 h-4 text-gray-400 dark:text-gray-200" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { 
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" }
              })}
              placeholder="Enter your password"
              className="w-full border rounded p-2 pl-8 bg-gray-50 dark:bg-gray-600 dark:text-white"
            />
            <Lock className="absolute left-2 top-10 w-4 h-4 text-gray-400 dark:text-gray-200" />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-10 cursor-pointer text-gray-500 dark:text-gray-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 " />}
            </span>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message as string}</p>}
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-1 dark:text-gray-300">
              <input type="checkbox" className="w-4 h-4" /> Remember me
            </label>
            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-200 mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-500 dark:text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>

        <p className="text-xs text-center text-gray-400 dark:text-gray-200 mt-4">
          By signing in, you agree to our terms & privacy policy.
        </p>
      </div>

      <div className="text-center">
        <Link href="/home" className="text-sm text-gray-900 dark:text-gray-100 hover:text-gray-600">
          ← Back to home
        </Link>
      </div>

      {showReset && <ResetPasswordModal onClose={() => setShowReset(false)} />}
    </div>
  );
}
