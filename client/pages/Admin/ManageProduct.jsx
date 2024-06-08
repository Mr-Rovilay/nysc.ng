import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../middleware/AuthContext";
import { FaTrashAlt } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { userRequest } from "../../middleware/middleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Card, Typography } from "@material-tailwind/react";
import Pagination from "../../src/components/Pagination";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      getProducts(currentPage);
    }
  }, [isAuthenticated, currentPage]);

  const getProducts = async (page) => {
    try {
      const response = await userRequest.get(`/products?page=${page}`);
      setProducts(response.data.products);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  const deleteProduct = async (productId) => {
    setLoadingProduct(productId);
    try {
      await userRequest.delete(`/products/${productId}`);
      toast.success("Product deleted successfully");
      getProducts(currentPage);
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setLoadingProduct(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!isAuthenticated) {
    return <div>Please login to access this page.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h5 className="text-lg font-semibold">All Products</h5>
        <h5 className="text-lg font-semibold">
          Total Products: {products.length}
        </h5>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  #
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Image
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Title
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Stock
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Categories
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Price
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Edit
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Delete
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id}>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {index + 1}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal capitalize"
                  >
                    <div className="w-12 h-12 overflow-hidden rounded-full">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal capitalize"
                  >
                    {product.title}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {product.stock}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {product.categories}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {product.price}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    as="a"
                    href={`products/${product._id}/edit`}
                    variant="small"
                    color="blue-gray"
                    className="font-medium text-green-900"
                  >
                    <AiOutlineEdit className="text-2xl bg:text-green-300" />
                  </Typography>
                </td>
                <td className="p-4">
                  <button
                    className="hover:bg-red-600"
                    onClick={() => deleteProduct(product._id)}
                    disabled={loadingProduct === product._id}
                  >
                    {loadingProduct === product._id ? (
                      <Button loading={true} color="red">
                        Loading
                      </Button>
                    ) : (
                      <FaTrashAlt className="text-red-500" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="flex justify-center mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ManageProduct;
