"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, Lock, EyeOff, Eye } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { handleError } from "@/lib/utils";
import { useTranslations } from "next-intl";

  const router = useRouter();
  const { register: createAccount } = useAuth();
  const t = useTranslations('register');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      setServerError(null);
      delete data.confirmPassword;
      await createAccount({
        ...data,
        allergies: data.allergies
          ? data.allergies.split(",").map((a: string) => a.trim())
          : undefined,
      });
      router.push("/dashboard");
      reset();
    } catch (error: unknown) {
      setServerError(handleError(error));
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4 items-center justify-center 
      bg-gradient-to-b from-blue-50 to-green-50 
      dark:from-gray-900 dark:to-gray-800">

      <Logo />

      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-center mb-1 flex items-center justify-center gap-2 dark:text-white">
          <User className="w-5 h-5" /> {t("head")}
        </h3>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
          {t("subhead")}
        </p>
        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

        <form method="POST" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Full Name */}
          <div className="relative">
            <label className="block mb-1 font-medium dark:text-gray-200">{t("nameLabel")}</label>
            <input
              type="text"
              {...register("name", {
                required: t("nameRequired"),
                minLength: { value: 3, message: t("nameMinLength") },
                maxLength: { value: 30, message: t("nameMaxLength") },
              })}
              placeholder={t("namePlaceholder")}
              className={`w-full border rounded p-2 pl-8 bg-gray-50 dark:bg-gray-600 dark:text-white ${errors.name ? "border-red-500" : ""
                }`}
            />
            <User className="absolute left-2 top-10 w-4 h-4 text-gray-400 dark:text-gray-200" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block mb-1 font-medium dark:text-gray-200">{t("emailLabel")}</label>
            <input
              type="email"
              {...register("email", {
                required: t("emailRequired"),
                pattern: { value: /^\S+@\S+$/i, message: t("emailInvalid") },
              })}
              placeholder={t("emailPlaceholder")}
              className="w-full border rounded p-2 pl-8 bg-gray-50 dark:bg-gray-600 dark:text-white"
            />
            <Mail className="absolute left-2 top-10 w-4 h-4 text-gray-400 dark:text-gray-200" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
          </div>

          {/* Phone */}
          <div className="relative">
            <label className="block mb-1 font-medium dark:text-gray-200">{t("phoneLabel")}</label>
            <input
              type="tel"
              {...register("phone", {
                required: t("phoneRequired"),
                pattern: {
                  value: /^01[0125][0-9]{8}$/,
                  message: t("phoneInvalid"),
                },
              })}
              placeholder={t("phonePlaceholder")}
              className={`w-full border rounded p-2 pl-8 bg-gray-50 dark:bg-gray-600 dark:text-white ${errors.phone ? "border-red-500" : ""
                }`}
            />
            <Phone className="absolute left-2 top-10 w-4 h-4 text-gray-400 dark:text-gray-200" />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message as string}</p>}
          </div>

          {/* Gender */}
          <div className="relative">
            <label className="block mb-1 font-medium dark:text-gray-200">{t("genderLabel")}</label>
            <select
              className={`w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-600 dark:text-white ${errors.gender ? "border-red-500" : ""
                }`}
              {...register("gender", { required: t("genderRequired") })}
            >
              <option value="">{t("genderSelect")}</option>
              <option value="male">{t("genderMale")}</option>
              <option value="female">{t("genderFemale")}</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message as string}</p>}
          </div>

          {/* Birth Date */}
          <div className="relative">
            <label className="block mb-1 font-medium dark:text-gray-200">{t("birthDateLabel")}</label>
            <input
              type="date"
              className={`w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-600 dark:text-white ${errors.birthDate ? "border-red-500" : ""
                }`}
              {...register("birthDate", { required: t("birthDateRequired") })}
            />
            {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate.message as string}</p>}
          </div>

          {/* Blood Type */}
          <div className="relative">
            <label className="block mb-1 font-medium dark:text-gray-200">{t("bloodTypeLabel")}</label>
            <select
              className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-600 dark:text-white"
              {...register("bloodType")}
            >
              <option value="">{t("bloodTypeSelect")}</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-1 font-medium dark:text-gray-200">{t("passwordLabel")}</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: t("passwordRequired"),
                minLength: { value: 8, message: t("passwordMinLength") }
              })}
              placeholder={t("passwordPlaceholder")}
              className={`w-full border rounded p-2 pl-8 bg-gray-50 dark:bg-gray-600 dark:text-white ${errors.password ? "border-red-500" : ""
                }`}
            />
            <Lock className="absolute left-2 top-10 w-4 h-4 text-gray-400 dark:text-gray-200" />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-10 cursor-pointer text-gray-500 dark:text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message as string}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block mb-1 font-medium dark:text-gray-200">{t("confirmPasswordLabel")}</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: t("confirmPasswordRequired"),
                validate: (value) => value === watch("password") || t("confirmPasswordMatch"),
              })}
              placeholder={t("confirmPasswordPlaceholder")}
              className="w-full border rounded p-2 pl-8 bg-gray-50 dark:bg-gray-600 dark:text-white"
            />
            <Lock className="absolute left-2 top-10 w-4 h-4 text-gray-400 dark:text-gray-200" />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-10 cursor-pointer text-gray-500 dark:text-gray-300"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message as string}</p>}
          </div>

          {/* Allergies */}
          <div>
            <label className="block mb-1 font-medium dark:text-gray-200">{t("allergiesLabel")}</label>
            <textarea
              placeholder={t("allergiesPlaceholder")}
              className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-600 dark:text-white"
              {...register("allergies")}
            ></textarea>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("creating") : t("createAccount")}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-200 mt-3">
          {t("alreadyAccount")} {" "}
          <Link href="/login" className="text-blue-500 dark:text-blue-400 hover:underline">
            {t("signIn")}
          </Link>
        </p>

        <p className="text-xs text-center text-gray-400 dark:text-gray-300 mt-4">
          {t("footer")}
        </p>
      </div>
    </div>
  );
