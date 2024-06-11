import React from "react";
import { IoClose } from "react-icons/io5";
import { MdDashboard, MdManageAccounts } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { Link, NavLink, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [open, setOpen] = React.useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return (
    <React.Fragment>
      <div className="container flex items-center justify-between max-w-7xl mx-auto px-4 py-2 lg:px-8 lg:py-4">
        <Button
          onClick={openDrawer}
          className="font-medium bg-green-500 text-white"
        >
          <div>
            <RiDashboardHorizontalFill />
          </div>
        </Button>
        <Link to={"/"}>
          <Button className="font-medium bg-green-500 text-white sm:hidden">
            Home
          </Button>
        </Link>
      </div>
      <Outlet />
      <Drawer open={open} onClose={closeDrawer} className="bg-gray-100">
        <div className="bg-gray-100">
          <div className="mb-2 flex items-center justify-between p-4">
            <Typography color="blue-gray" className="py-1.5 font-medium">
              Admin
            </Typography>
            <IconButton
              className="text-2xl"
              variant="text"
              color="blue-gray"
              onClick={closeDrawer}
            >
              <IoClose />
            </IconButton>
          </div>

          <List>
            <ListItem onClick={closeDrawer}>
              <ListItemPrefix className="text-2xl">
                <MdDashboard />
              </ListItemPrefix>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  isActive ? "font-bold text-green-500" : ""
                }
              >
                Dashboard
              </NavLink>
            </ListItem>
            <ListItem onClick={closeDrawer}>
              <ListItemPrefix className="text-2xl">
                <IoCreateOutline />
              </ListItemPrefix>
              <NavLink
                to="/admin/dashboard/create-product"
                className={({ isActive }) =>
                  isActive ? "font-bold text-green-500" : ""
                }
              >
                Create Product
              </NavLink>
            </ListItem>
            <ListItem onClick={closeDrawer}>
              <ListItemPrefix className="text-2xl">
                <MdManageAccounts />
              </ListItemPrefix>
              <NavLink
                to="/admin/dashboard/manageProducts"
                className={({ isActive }) =>
                  isActive ? "font-bold text-green-500" : ""
                }
              >
                Manage Products
              </NavLink>
            </ListItem>
            <ListItem onClick={closeDrawer}>
              <ListItemPrefix className="text-2xl">
                <MdManageAccounts />
              </ListItemPrefix>
              <NavLink
                to="/admin/dashboard/manageOrders"
                className={({ isActive }) =>
                  isActive ? "font-bold text-green-500" : ""
                }
              >
                Manage Orders
              </NavLink>
            </ListItem>
            <ListItem onClick={closeDrawer}>
              <ListItemPrefix className="text-2xl">
                <FaUsers />
              </ListItemPrefix>
              <NavLink
                to="/admin/dashboard/users"
                className={({ isActive }) =>
                  isActive ? "font-bold text-green-500" : ""
                }
              >
                All Users
              </NavLink>
            </ListItem>
          </List>
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default DashboardLayout;
