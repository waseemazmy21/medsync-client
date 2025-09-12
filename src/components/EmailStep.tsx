import { useForm } from "react-hook-form";

export default function EmailStep({ onNext, onClose }: { onNext: (data: any) => void; onClose: () => void }) {
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitEmail = (data: any) => {
    console.log("Email submitted:", data.email);
    onNext();
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-2">Reset Password</h2>
      <p className="text-gray-500 text-sm mb-4">
        Enter your email to receive a verification code
      </p>

      <form onSubmit={handleSubmit(submitEmail)} className="space-y-4">
        
        
          <input
        type="email"
        placeholder="Enter your email"
        className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200 ${
          errors.email ? "border-red-500" : ""
        }`}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email address",
          },
        })}
      />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message as string}</p>
      )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-1/2 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Send Code
          </button>
        </div>
      </form>
    </>
  );
}


