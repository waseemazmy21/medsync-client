import { useForm } from "react-hook-form";

interface PasswordStepProps {
  onBack: () => void;
  onClose: () => void;
}

export default function PasswordStep({
  onBack,
  onClose,
}: PasswordStepProps) {

   const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const submitPassword = (data: any) => {
    console.log("New password set:", data.password);
    onClose();
  };


  return (
    <>
      <h2 className="text-xl font-bold mb-2">Set New Password</h2>
      <p className="text-gray-500 text-sm mb-4">
        Create a new password for your account
      </p>

      <form onSubmit={handleSubmit(submitPassword)} className="space-y-4">
      <input
        type="password"
        placeholder="New password"
        className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200 ${
          errors.password ? "border-red-500" : ""
        }`}
        {...register("password", {
          required: "Password is required",
          minLength: { value: 6, message: "At least 6 characters" },
        })}
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message as string}</p>
      )}
        <input
        type="password"
        placeholder="Confirm password"
        className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200 ${
          errors.confirm ? "border-red-500" : ""
        }`}
        {...register("confirm", {
          required: "Confirm your password",
          validate: (value) =>
            value === watch("password") || "Passwords do not match",
        })}
      />
      {errors.confirm && (
        <p className="text-red-500 text-sm">{errors.confirm.message as string}</p>
      )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBack}
            className="w-1/2 py-2 border rounded-md hover:bg-gray-100"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-1/2 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Save Password
          </button>
        </div>
      </form>
    </>
  );
}
