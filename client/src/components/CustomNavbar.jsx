import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Input,
  Collapse,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { FiShoppingCart } from "react-icons/fi";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import ContactPop from "./ContactPop";
import { AuthContext } from "../../middleware/AuthContext";
import useCart from "../../middleware/useCart";

const profileMenuItems = [
  { label: "My Profile", icon: UserCircleIcon, to: "#" },
  { label: "Orders", icon: InboxArrowDownIcon, to: "/myOrders" },
  { label: "Settings", icon: LifebuoyIcon, to: "#" },
];

const CustomNavbar = () => {
  const [openNav, setOpenNav] = useState(false);
  const { isAuthenticated, logout, userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, refetch] = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {["Home", "Products", "About us"].map((item) => (
        <Typography
          key={item}
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-medium"
        >
          <Link
            to={
              item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "")}`
            }
            className="flex items-center"
          >
            {item}
          </Link>
        </Typography>
      ))}
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <ContactPop />
      </Typography>
    </ul>
  );

  return (
    <Navbar className="container sticky bg-transparent top-0 z-50 h-max max-w-full rounded-md px-4 py-2 lg:px-8 lg:py-4 w-full shadow-md">
      <div className="flex items-center justify-between">
        <Link to={"/"}>
          <Typography className="mr-4 cursor-pointer py-1.5 font-medium text-green-500">
            NYSCKIT.NG
          </Typography>
        </Link>
        <div className="hidden lg:flex items-center gap-4">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex w-full gap-2 md:w-max"
          >
            <Input
              type="search"
              label="Type here..."
              className="pr-20"
              value={searchQuery}
              onChange={handleSearchChange}
              containerProps={{ className: "min-w-[288px]" }}
            />
            <Button
              size="sm"
              type="submit"
              className="!absolute right-1 top-1 rounded font-medium bg-green-500"
            >
              Search
            </Button>
          </form>
          {navList}
        </div>
        <div className="flex items-center gap-4">
          <Link to={"/cart"}>
            <IconButton variant="text" color="blue-gray" className="relative">
              <FiShoppingCart size={24} />
              {cart.products && cart.products.length > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                  {cart.products.length}
                </span>
              )}
            </IconButton>
          </Link>
          {isAuthenticated ? (
            <Menu>
              <MenuHandler>
                <Button variant="text" className="flex items-center gap-2">
                  <UserCircleIcon className="h-5 w-5" />
                </Button>
              </MenuHandler>
              <MenuList className="p-1">
                {profileMenuItems.map(({ label, icon, to }, key) => (
                  <MenuItem
                    key={label}
                    className="flex items-center gap-2 rounded hover:bg-gray-200"
                  >
                    {React.createElement(icon, {
                      className: "h-4 w-4",
                      strokeWidth: 2,
                    })}
                    <Link to={to} className="flex items-center">
                      <Typography
                        as="span"
                        variant="small"
                        className="font-normal"
                      >
                        {label}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
                {userInfo?.isAdmin === true && (
                  <MenuItem
                    key="Admin"
                    className="flex items-center gap-2 rounded hover:bg-gray-200"
                  >
                    {React.createElement(Cog6ToothIcon, {
                      className: "h-4 w-4",
                      strokeWidth: 2,
                    })}
                    <Link to="/admin/dashboard" className="flex items-center">
                      <Typography
                        as="span"
                        variant="small"
                        className="font-normal"
                      >
                        Admin
                      </Typography>
                    </Link>
                  </MenuItem>
                )}
                <MenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                >
                  <PowerIcon className="h-4 w-4 text-red-500" strokeWidth={2} />
                  <Typography
                    as="span"
                    variant="small"
                    className="font-normal"
                    color="red"
                  >
                    Sign Out
                  </Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <div className="hidden lg:flex items-center gap-x-1">
              <Button variant="text" size="sm">
                <Link to="/signin">
                  <span>Log In</span>
                </Link>
              </Button>
              <Link to="/signup">
                <Button variant="gradient" size="sm">
                  <span>Sign Up</span>
                </Button>
              </Link>
            </div>
          )}
          <IconButton
            variant="text"
            className="ml-auto lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav}>
        <div className="relative flex w-full gap-2 md:w-max p-4 lg:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex w-full gap-2 md:w-max"
          >
            <Input
              type="search"
              label="Type here..."
              className="pr-20"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button
              size="sm"
              type="submit"
              className="bg-green-500 right-1 top-1 rounded"
            >
              Search
            </Button>
          </form>
        </div>
        {navList}
        {!isAuthenticated && (
          <div className="flex items-center gap-x-1">
            <Button fullWidth variant="text" size="sm">
              <Link to={"/signin"}>
                <span>Log In</span>
              </Link>
            </Button>
            <Button fullWidth variant="gradient" size="sm">
              <Link to={"/signup"}>
                <span>Sign Up</span>
              </Link>
            </Button>
          </div>
        )}
      </Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
