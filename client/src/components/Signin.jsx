import { useState, useContext } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import AnimationWrapper from "../common/AnimationWrapper";
import { useNavigate } from "react-router-dom";
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
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    if (!email.length) {
      return toast.error("Enter email address");
    }
    if (!emailRegex.test(email)) {
      return toast.error("invalid email address");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "password should be 6 to 20 characters long with numeric, 1 lowercase and 1 uppercase letter"
      );
    }
    try {
      const response = await publicRequest.post("/auth/signin", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      login(token); // Pass the token to the login function
      navigate("/");
      toast.success("Sign in successful");
    } catch (error) {
      toast.error("User not found");
      console.error(error);
    }
  };

  return (
    <>
      <AnimationWrapper>
        <ToastContainer />
        <section className="grid text-center h-screen items-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-[24rem] mx-auto">
            <Typography variant="h3" color="blue-gray" className="mb-2">
              Sign In
            </Typography>
            <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
              Enter your email and password to sign in
            </Typography>
            <form action="#" className="mx-auto max-w-[24rem] text-left">
              <div className="mb-6">
                <label htmlFor="email">
                  <Typography
                    variant="small"
                    className="mb-2 block font-medium text-gray-900"
                  >
                    Your Email
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
                className="mt-6"
                fullWidth
              >
                sign in
              </Button>
              <div className="!mt-4 flex justify-end">
                <Typography
                  as="a"
                  href="#"
                  color="blue-gray"
                  variant="small"
                  className="font-medium"
                >
                  Forgot password
                </Typography>
              </div>
              <Button
                variant="outlined"
                size="lg"
                className="mt-6 flex h-12 items-center justify-center gap-2"
                fullWidth
              >
                <img
                  src={`https://www.material-tailwind.com/logos/logo-google.png`}
                  alt="google"
                  className="h-6 w-6"
                />{" "}
                sign in with google
              </Button>
              <Typography
                variant="small"
                color="gray"
                className="!mt-4 text-center font-normal"
              >
                Not registered?{" "}
                <a href="/signup" className="font-medium text-gray-900">
                  Create account
                </a>
              </Typography>
            </form>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default Signin;
