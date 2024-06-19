import { useState } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { publicRequest } from "../../middleware/middleware";
import AnimationWrapper from "../common/AnimationWrapper";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { id, token } = useParams();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown((prev) => !prev);
  };

  const handleSignIn = async () => {
    if (!password) {
      toast.error("Password cannot be empty");
      return;
    }

    setIsLoading(true);

    try {
      const response = await publicRequest.post(
        `/auth/reset-password/${id}/${token}`,
        {
          newPassword: password,
        }
      );

      if (response.data.status === "Success") {
        toast.success(response.data.message);
        setPassword("");
        navigate("/signin");
      } else {
        toast.error(
          response.data.message || "Failed to send reset link. Try again."
        );
      }

      navigate("/signin");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSignIn();
    }
  };

  return (
    <AnimationWrapper>
      <ToastContainer />
      <section className="container grid h-screen items-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mx-auto">
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Reset Password
          </Typography>
          <form
            onKeyPress={handleKeyPress}
            className="mx-auto max-w-[24rem] text-left"
          >
            <div className="mb-6">
              <label htmlFor="password">
                <Typography
                  variant="small"
                  className="mb-2 block font-medium text-gray-900"
                >
                  Password
                </Typography>
              </label>
              <Input
                id="password"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                type={passwordShown ? "text" : "password"}
                icon={
                  <i onClick={togglePasswordVisibility}>
                    {passwordShown ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </i>
                }
              />
            </div>
            <Button
              onClick={handleSignIn}
              color="gray"
              size="lg"
              className="mt-6 flex items-center justify-center"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : "Update Password"}
            </Button>
          </form>
        </div>
      </section>
    </AnimationWrapper>
  );
};

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default ResetPassword;
