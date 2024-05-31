import React from "react";
import { IoClose } from "react-icons/io5";
import {
  MdDashboard,
  MdOutlineSystemUpdate,
  MdManageAccounts,
} from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
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
import { Outlet, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <React.Fragment>
      <div className="flex items-center justify-between mx-4 max-w-7xl mx-auto px-4 py-2 lg:px-8 lg:py-4">
        <Button onClick={openDrawer} className="bg-black text-white">
          <div>
            <RiDashboardHorizontalFill />
          </div>
        </Button>

        <Button
          onClick={handleLogout}
          className="btn rounded-md px-6 bg-black text-white sm:hidden"
        >
          Logout
        </Button>
      </div>
      <Outlet />
      <Drawer open={open} onClose={closeDrawer} className="bg-gray-100">
        <div className="bg-gray-100">
          <div className="mb-2 flex items-center justify-between p-4">
            <Typography variant="h5" color="blue-gray">
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

          <List className="">
            <ListItem>
              <ListItemPrefix className="text-2xl">
                <MdDashboard />
              </ListItemPrefix>
              <a href="/dashboard">Dashboard</a>
            </ListItem>
            <ListItem>
              <ListItemPrefix>
                <IoCreateOutline className="text-2xl" />
              </ListItemPrefix>
              <a href="/dashboard/create-product">CreateProduct</a>
            </ListItem>
            <ListItem>
              <ListItemPrefix className="text-2xl">
                <MdManageAccounts />
              </ListItemPrefix>
              <a href="/dashboard/manage-products">ManageProduct</a>
            </ListItem>
            <ListItem>
              <ListItemPrefix className="text-2xl">
                <FaUsers />
              </ListItemPrefix>
              <a href="/dashboard/users">All users</a>
            </ListItem>
          </List>
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default DashboardLayout;
