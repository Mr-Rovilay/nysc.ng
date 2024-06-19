import { useState, useContext } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AnimationWrapper from "../src/common/AnimationWrapper";
import { publicRequest } from "../middleware/middleware";
import { AuthContext } from "../middleware/AuthContext";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!email.length) {
      return toast.error("Enter email address");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Invalid email address");
    }

    setIsLoading(true);

    try {
      const response = await publicRequest.post("/auth/forgot-password", {
        email,
      });
      if (response.data.status === "Success") {
        toast.success(
          "Password reset link sent successfully. Check your email."
        );
        navigate("/signin");
      } else {
        toast.error(
          response.data.message || "Failed to send reset link. Try again."
        );
      }
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
    <>
      <AnimationWrapper>
        <ToastContainer />
        <section className="container grid h-screen items-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-8 mx-auto">
            <Typography variant="h3" color="blue-gray" className="mb-2">
              Forgot Password
            </Typography>
            <form
              action="#"
              className="mx-auto max-w-[24rem] text-left"
              onKeyPress={handleKeyPress}
            >
              <div className="mb-6">
                <label htmlFor="email">
                  <Typography
                    variant="small"
                    className="mb-2 block font-medium text-gray-900"
                  >
                    Email
                  </Typography>
                </label>
                <Input
                  id="email"
                  color="gray"
                  size="lg"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  labelProps={{
                    className: "hidden",
                  }}
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
                {isLoading ? <LoadingSpinner /> : "Send"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Typography variant="small" color="gray" className="font-normal">
                Remembered your password?{" "}
                <Link to="/login" className="font-medium text-gray-900">
                  Sign In
                </Link>
              </Typography>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

const LoadingSpinner = () => {
  return (
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
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export default ForgotPassword;
