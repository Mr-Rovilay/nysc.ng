import { Link } from "react-router-dom";
import Button from "../src/components/Button";
import AnimationWrapper from "../src/common/AnimationWrapper";

const Signup = () => {
  return (
    <AnimationWrapper>
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="flex items-center mb-6">
            <Link to="/">
              <img
                className="h-24 object-cover rounded-full shadow-lg"
                src="https://dailypost.ng/wp-content/uploads/2020/05/1_NBBsLhguP_B8dF6s02fY8g.jpeg"
                alt="logo"
              />
            </Link>
          </div>
          <div className="px-14 bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:text-gray-800  dark:border-gray-700 shadow-lg">
            <div className="p-6 space-y-8 md:space-y-8 w-full sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-green-500 md:text-2xl ">
                Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    id="fullname"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="your full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="name@company.com"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>
                <div className="flex items-center justify-center w-full">
                  <Button
                    text="Create an Account"
                    variant="secondary"
                    className="w-full"
                  />
                </div>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default Signup;
