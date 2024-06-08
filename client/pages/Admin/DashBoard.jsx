import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Typography, Button } from "@material-tailwind/react";
import { userRequest } from "../../middleware/middleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../src/components/Loading";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          userRequest.get("/users"),
          userRequest.get("/products"),
          userRequest.get("/orders"),
        ]);

        // Logging the response data to understand its structure
        console.log("Users Response:", usersRes);
        console.log("Products Response:", productsRes);
        console.log("Orders Response:", ordersRes);

        // Extracting the arrays from the response data
        const usersArray = usersRes.data;
        const productsArray = productsRes.data.products;
        const ordersArray = ordersRes.data.orders;

        if (
          Array.isArray(usersArray) &&
          Array.isArray(productsArray) &&
          Array.isArray(ordersArray)
        ) {
          const totalSales = ordersArray((acc, order) => acc + order.amount, 0);

          setSummary({
            totalUsers: usersArray.length,
            totalProducts: productsArray.length,
            totalOrders: ordersArray.length,
            totalSales,
          });
        } else {
          console.error("Unexpected response structure", {
            usersRes,
            productsRes,
            ordersRes,
          });
          toast.error(
            "Unexpected response structure. Please check the console for details."
          );
        }

        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching summary data:", error);
        toast.error("Failed to fetch summary data");
        setLoading(false); // Stop loading on error
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="mt-3">
        <Loading />
      </div>
    ); // Loading state UI
  }

  return (
    <div className="p-4">
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
