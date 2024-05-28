import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Collapse,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import { FiShoppingCart } from "react-icons/fi";
import { AuthContext } from "../../middleware/AuthContext";

// Profile menu items
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
  },
  {
    label: "Inbox",
    icon: InboxArrowDownIcon,
  },
  {
    label: "Help",
    icon: LifebuoyIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

const CustomNavbar = () => {
  const [openNav, setOpenNav] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [cartItems, setCartItems] = useState(3);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const closeMenu = () => setOpenProfileMenu(false);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="/" className="flex items-center">
          Home
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="/products" className="flex items-center">
          Products
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="#" className="flex items-center">
          Contacts
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="#" className="flex items-center">
          About us
        </Link>
      </Typography>
    </ul>
  );

  return (
    <div className="sticky top-0 w-full bg-white shadow-md z-50">
      <Navbar className="max-w-7xl mx-auto px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography
            as="a"
            href="/"
            className="mr-4 cursor-pointer py-1.5 text-xl font-semibold"
          >
            NYSCKIT.NG
          </Typography>
          <div className="hidden lg:flex md:items-center md:gap-4">
            <div className="relative flex w-full gap-2 md:w-max">
              <Input
                type="search"
                label="Type here..."
                className="pr-20"
                containerProps={{
                  className: "min-w-[288px]",
                }}
              />
              <Button size="sm" className="!absolute right-1 top-1 rounded">
                Search
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">{navList}</div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Menu open={openProfileMenu} handler={setOpenProfileMenu}>
                <MenuHandler>
                  <IconButton
                    variant="text"
                    className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent"
                  >
                    <UserCircleIcon className="h-6 w-6" />
                  </IconButton>
                </MenuHandler>
                <MenuList className="p-1">
                  {profileMenuItems.map(({ label, icon }, key) => {
                    const isLastItem = key === profileMenuItems.length - 1;
                    return (
                      <MenuItem
                        key={label}
                        onClick={isLastItem ? handleLogout : closeMenu}
                        className={`flex items-center gap-2 rounded ${
                          isLastItem
                            ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                            : ""
                        }`}
                      >
                        {React.createElement(icon, {
                          className: `h-4 w-4 ${
                            isLastItem ? "text-red-500" : ""
                          }`,
                          strokeWidth: 2,
                        })}
                        <Typography
                          as="span"
                          variant="small"
                          className="font-normal"
                          color={isLastItem ? "red" : "inherit"}
                        >
                          {label}
                        </Typography>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button
                  variant="text"
                  size="sm"
                  className="hidden lg:inline-block"
                >
                  <Link to="/signin">
                    <span>Sign In</span>
                  </Link>
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  className="hidden lg:inline-block"
                >
                  <Link to="/signup">
                    <span>Sign Up</span>
                  </Link>
                </Button>
              </>
            )}
            <div className="relative">
              <Link to="/cart">
                <IconButton
                  variant="text"
                  className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent"
                >
                  <FiShoppingCart className="h-6 w-6" />
                  {cartItems > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {cartItems}
                    </span>
                  )}
                </IconButton>
              </Link>
            </div>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
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
          <div className="relative flex w-full gap-2 mb-4">
            <Input
              type="search"
              label="Type here..."
              className="pr-20"
              containerProps={{
                className: "min-w-[288px]",
              }}
            />
            <Button size="sm" className="!absolute right-1 top-1 rounded">
              Search
            </Button>
          </div>
          <div className=" lg:block">{navList}</div>
          <div className="flex items-center gap-x-1">
            {isAuthenticated ? (
              profileMenuItems.map(({ label, icon }, key) => {
                const isLastItem = key === profileMenuItems.length - 1;
                return (
                  <MenuItem
                    key={label}
                    onClick={isLastItem ? handleLogout : closeMenu}
                    className={`flex items-center gap-2 rounded ${
                      isLastItem ? "active:bg-red-500/10" : "text-black"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                      strokeWidth: 2,
                    })}
                    <Typography
                      as="span"
                      variant="small"
                      className="font-normal"
                      color={isLastItem ? "red" : "inherit"}
                    >
                      {label}
                    </Typography>
                  </MenuItem>
                );
              })
            ) : (
              <>
                <Button fullWidth variant="text" size="sm" className="">
                  <Link to="/signin">
                    <span>Sign In</span>
                  </Link>
                </Button>
                <Button fullWidth variant="gradient" size="sm" className="">
                  <Link to="/signup">
                    <span>Sign Up</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default CustomNavbar;
