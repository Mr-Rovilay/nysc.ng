import { useState, useContext } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import AnimationWrapper from "../common/AnimationWrapper";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { publicRequest } from "../../middleware/middleware";
import { AuthContext } from "../../middleware/AuthContext";

const Signin = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    if (!email.length) {
      return toast.error("Enter email address");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Invalid email address");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 to 20 characters long with numeric, 1 lowercase and 1 uppercase letter"
      );
    }

    setIsLoading(true);

    try {
      const response = await publicRequest.post("/auth/signin", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      login(token);
      navigate("/");
      toast.success("Sign in successful");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error); // Display the server error message
      } else {
        toast.error("An error occurred. Please try again.");
      }
      console.error(error);
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
        <section className="container grid text-center h-screen items-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-[24rem] mx-auto">
            <Typography variant="h3" color="blue-gray" className="mb-2">
              Sign In
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
                  placeholder="name@mail.com"
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  labelProps={{
                    className: "hidden",
                  }}
                />
              </div>
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
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  type={passwordShown ? "text" : "password"}
                  icon={
                    <i onClick={togglePasswordVisiblity}>
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
                {isLoading ? <LoadingSpinner /> : "Sign In"}
              </Button>
              <div className="!mt-4 flex justify-end">
                <Typography
                  as="a"
                  href="/forgot-password"
                  color="blue-gray"
                  variant="small"
                  className="font-medium"
                >
                  Forgot password ?
                </Typography>
              </div>
              <Typography
                variant="small"
                color="gray"
                className="!mt-4 text-center font-normal"
              >
                Not registered?{" "}
                <Link to="/signup" className="font-medium text-gray-900">
                  Create account
                </Link>
              </Typography>
            </form>
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

export default Signin;
