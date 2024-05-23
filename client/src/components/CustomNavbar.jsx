import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import Button from "./Button";
import { Link } from "react-router-dom";

const CustomNavbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  const menuHandler = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`flex justify-between items-center bg-white h-20 p-6 md:p-12 w-full md:w-[85%] m-auto fixed left-1/2 transform -translate-x-1/2 drop-shadow-xl z-20 ${
          scrolling ? "top-0 w-full rounded-none md:p-6" : "top-5 rounded-xl"
        }`}
      >
        <div className="flex items-center">
          <Link to={"/"}>
            <h1 className="text-2xl font-bold italic uppercase text-green-500">
              NYSCkit.NG
            </h1>
          </Link>
        </div>
        <ul
          className={`md:flex gap-12 font-medium text-gray-700 [&>li]:cursor-pointer absolute md:static top-20 bg-white max-md:p-3 text-left ${
            openMenu ? "animate-fadeInDown" : "hidden"
          } ${
            scrolling && openMenu
              ? "top-12 w-full right-0 rounded-b-none"
              : "rounded-b-xl right-0 w-full md:w-auto"
          }`}
          style={{ left: 0 }}
        >
          <Link to={"/"}>
            <li className="hover:text-green-500 ml-2 mb-2 md:mb-0">
              <a href="/">Home</a>
            </li>
          </Link>
          <li className="hover:text-green-500 ml-2 mb-2 md:mb-0">
            <a href="/">About</a>
          </li>
          <li className="hover:text-green-500 ml-2 mb-2 md:mb-0">
            <a href="/">Pricing</a>
          </li>
          <li className="hover:text-green-500 ml-2 mb-2 md:mb-0">
            <a href="/">Testimonials</a>
          </li>
          <div className="md:hidden flex flex-col gap-2 mt-4">
            <Link to={"/signin"}>
              <Button text="Sign In" variant="primary" />
            </Link>
            <Link to={"/signup"}>
              <Button text="Sign Up" variant="secondary" />
            </Link>
          </div>
        </ul>
        <div className="hidden md:flex items-center gap-x-1">
          <Link to={"/signin"}>
            <Button text="Sign In" variant="primary" />
          </Link>
          <Link to={"/signup"}>
            <Button text="Sign Up" variant="secondary" />
          </Link>
        </div>

        {/* MOBILE MENU ICONS */}
        <div className="md:hidden">
          <button
            className="text-gray-700"
            onClick={menuHandler}
            aria-label="Menu"
          >
            {openMenu ? <GrClose size={25} /> : <FiMenu size={25} />}
          </button>
        </div>
      </nav>
      {openMenu && (
        <div
          onClick={menuHandler}
          className="h-screen w-screen absolute top-0 left-0 z-10"
        ></div>
      )}
    </>
  );
};

export default CustomNavbar;
