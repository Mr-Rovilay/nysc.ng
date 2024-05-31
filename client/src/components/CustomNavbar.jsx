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
import ContactPop from "./ContactPop";
import { useCart } from "../../middleware/useCart";

const profileMenuItems = [
  { label: "My Profile", icon: UserCircleIcon },
  { label: "Edit Profile", icon: Cog6ToothIcon },
  { label: "Inbox", icon: InboxArrowDownIcon },
  { label: "Help", icon: LifebuoyIcon },
  { label: "Sign Out", icon: PowerIcon },
];

const CustomNavbar = () => {
  const [openNav, setOpenNav] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  console.log(cartCount);

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
          About us
        </Link>
      </Typography>
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
                containerProps={{ className: "min-w-[288px]" }}
              />
              <Button size="sm" className="!absolute right-1 top-1 rounded">
                Search
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">{navList}</div>
          <div className="relative flex items-center gap-4">
            <a href="/cart">
              <IconButton
                variant="text"
                color="blue-gray"
                className="hidden lg:inline-block"
              >
                <FiShoppingCart size={24} />

                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                  {cartCount}
                </span>
              </IconButton>
            </a>
            {isAuthenticated ? (
              <Menu
                open={openProfileMenu}
                handler={setOpenProfileMenu}
                placement="bottom-end"
              >
                <MenuHandler>
                  <IconButton variant="text" color="blue-gray">
                    <UserCircleIcon className="h-6 w-6" />
                  </IconButton>
                </MenuHandler>
                <MenuList>
                  {profileMenuItems.map(({ label, icon }, key) => (
                    <MenuItem key={label} onClick={closeMenu}>
                      <Typography
                        as="span"
                        variant="small"
                        color="blue-gray"
                        className="flex items-center gap-2"
                      >
                        {React.createElement(icon, { className: "h-4 w-4" })}
                        {label}
                      </Typography>
                    </MenuItem>
                  ))}
                  <MenuItem onClick={handleLogout}>
                    <Typography
                      as="span"
                      variant="small"
                      color="blue-gray"
                      className="flex items-center gap-2"
                    >
                      <PowerIcon className="h-4 w-4" />
                      Sign Out
                    </Typography>
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                variant="gradient"
                size="sm"
                className="hidden lg:inline-block"
                onClick={() => navigate("/signin")}
              >
                <span>Login</span>
              </Button>
            )}
            <IconButton
              variant="text"
              color="blue-gray"
              className="lg:hidden"
              onClick={() => setOpenNav(!openNav)}
            >
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
                  d={
                    openNav ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"
                  }
                />
              </svg>
            </IconButton>
          </div>
        </div>
        <Collapse open={openNav}>
          <div className="container mx-auto">
            {navList}
            <div className="relative mt-2 flex items-center gap-4 lg:hidden">
              <IconButton variant="text" color="blue-gray">
                <FiShoppingCart size={24} />
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                  {cartCount}
                </span>
              </IconButton>
              {isAuthenticated ? (
                <Menu
                  open={openProfileMenu}
                  handler={setOpenProfileMenu}
                  placement="bottom-end"
                >
                  <MenuHandler>
                    <IconButton variant="text" color="blue-gray">
                      <UserCircleIcon className="h-6 w-6" />
                    </IconButton>
                  </MenuHandler>
                  <MenuList>
                    {profileMenuItems.map(({ label, icon }, key) => (
                      <MenuItem key={label} onClick={closeMenu}>
                        <Typography
                          as="span"
                          variant="small"
                          color="blue-gray"
                          className="flex items-center gap-2"
                        >
                          {React.createElement(icon, { className: "h-4 w-4" })}
                          {label}
                        </Typography>
                      </MenuItem>
                    ))}
                    <MenuItem onClick={handleLogout}>
                      <Typography
                        as="span"
                        variant="small"
                        color="blue-gray"
                        className="flex items-center gap-2"
                      >
                        <PowerIcon className="h-4 w-4" />
                        Sign Out
                      </Typography>
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Button
                  variant="gradient"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate("/signin")}
                >
                  <span>Login</span>
                </Button>
              )}
            </div>
          </div>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default CustomNavbar;
