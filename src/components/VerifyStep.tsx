import { useForm } from "react-hook-form";

export default function VerifyStep({ onBack, onNext }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitCode = (data) => {
    console.log("Verification code:", data.code);
    onNext();
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-2">Verify Code</h2>
      <p className="text-gray-500 text-sm mb-4">
        Enter the code sent to your email{" "}
        <span className="font-semibold">{email}</span>
      </p>

       <form onSubmit={handleSubmit(submitCode)} className="space-y-4">
      <input
        type="text"
        placeholder="Enter verification code"
        className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200 ${
          errors.code ? "border-red-500" : ""
        }`}
        {...register("code", {
          required: "Verification code is required",
          minLength: { value: 6, message: "Code must be 6 digits" },
          maxLength: { value: 6, message: "Code must be 6 digits" },
        })}
      />
      {errors.code && (
        <p className="text-red-500 text-sm">{errors.code.message}</p>
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
            Verify
          </button>
        </div>
      </form>
    </>
  );
}
