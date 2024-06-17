import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Typography, Button } from "@material-tailwind/react";
import { userRequest } from "../../middleware/middleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../src/components/Loading";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    deliveredOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [usersRes, productsRes, ordersRes, deliveredRes, completedRes] =
          await Promise.all([
            userRequest.get("/users"),
            userRequest.get("/products"),
            userRequest.get("/orders"),
            userRequest.get("/orders?status=delivered"),
            userRequest.get("/orders?status=completed"),
          ]);

        const usersCount = usersRes.data.count || 0;
        const productsArray = productsRes.data.products || [];
        const ordersArray = ordersRes.data.orders || [];
        const deliveredArray = deliveredRes.data.orders || [];
        const completedArray = completedRes.data.orders || [];

        if (
          typeof usersCount === "number" &&
          Array.isArray(productsArray) &&
          Array.isArray(ordersArray) &&
          Array.isArray(deliveredArray) &&
          Array.isArray(completedArray)
        ) {
          const totalSales = ordersArray.reduce(
            (acc, order) => acc + order.amount,
            0
          );

          setSummary({
            totalUsers: usersCount,
            totalProducts: productsArray.length,
            totalOrders: ordersArray.length,
            totalSales,
            deliveredOrders: deliveredArray.length,
            completedOrders: completedArray.length,
          });
        } else {
          toast.error(
            "Unexpected response structure. Please check the console for details."
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching summary data:", error);
        toast.error("Failed to fetch summary data");
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const orderStatusData = {
    labels: ["Total Orders", "Delivered Orders", "Completed Orders"],
    datasets: [
      {
        label: "Order Status",
        data: [
          summary.totalOrders,
          summary.deliveredOrders,
          summary.completedOrders,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container p-4">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Users" value={summary.totalUsers} />
        <DashboardCard title="Total Products" value={summary.totalProducts} />
        <DashboardCard title="Total Orders" value={summary.totalOrders} />
        <DashboardCard
          title="Total Sales"
          value={`$${summary.totalSales.toFixed(2)}`}
        />
        <DashboardCard
          title="Delivered Orders"
          value={summary.deliveredOrders}
        />
        <DashboardCard
          title="Completed Orders"
          value={summary.completedOrders}
        />
      </div>
      <div className="my-10">
        <Line data={orderStatusData} />
      </div>
      <div className="my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardLinkButton to="/admin/dashboard/manageProducts">
          Manage Products
        </DashboardLinkButton>
        <DashboardLinkButton to="/admin/dashboard/users">
          Manage Users
        </DashboardLinkButton>
        <DashboardLinkButton to="/admin/dashboard/manageOrders">
          Manage Orders
        </DashboardLinkButton>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value }) => (
  <Card>
    <Typography className="p-4" variant="h5">
      {title}
    </Typography>
    <Typography className="p-4" variant="h2">
      {value}
    </Typography>
  </Card>
);

const DashboardLinkButton = ({ to, children }) => (
  <Link to={to}>
    <Button color="green">{children}</Button>
  </Link>
);

export default Dashboard;
