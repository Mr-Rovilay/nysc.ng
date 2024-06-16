import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Typography, Button } from "@material-tailwind/react";
import { userRequest } from "../../middleware/middleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../src/components/Loading";
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
import { Line } from "react-chartjs-2";

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
    return (
      <div className="mt-3">
        <Loading />
      </div>
    );
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
        <Card>
          <Typography className="p-4" variant="h5">
            Total Users
          </Typography>
          <Typography className="p-4" variant="h2">
            {summary.totalUsers}
          </Typography>
        </Card>
        <Card>
          <Typography className="p-4" variant="h5">
            Total Products
          </Typography>
          <Typography className="p-4" variant="h2">
            {summary.totalProducts}
          </Typography>
        </Card>
        <Card>
          <Typography className="p-4" variant="h5">
            Total Orders
          </Typography>
          <Typography className="p-4" variant="h2">
            {summary.totalOrders}
          </Typography>
        </Card>
        <Card>
          <Typography className="p-4" variant="h5">
            Total Sales
          </Typography>
          <Typography className="p-4" variant="h2">
            ${summary.totalSales.toFixed(2)}
          </Typography>
        </Card>
        <Card>
          <Typography className="p-4" variant="h5">
            Delivered Orders
          </Typography>
          <Typography className="p-4" variant="h2">
            {summary.deliveredOrders}
          </Typography>
        </Card>
        <Card>
          <Typography className="p-4" variant="h5">
            Completed Orders
          </Typography>
          <Typography className="p-4" variant="h2">
            {summary.completedOrders}
          </Typography>
        </Card>
      </div>
      <div className="my-10">
        <Line data={orderStatusData} />
      </div>
      <div className="my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to={"/admin/dashboard/manageProducts"}>
          <Button color="green" as={Link} to="">
            Manage Products
          </Button>
        </Link>
        <Link to={"/admin/dashboard/users"}>
          <Button color="green">Manage Users</Button>
        </Link>
        <Link to={"/admin/dashboard/manageOrders"}>
          <Button color="green">Manage Orders</Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
