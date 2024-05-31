import { useState, useEffect, useContext } from "react";
import { FaTrashAlt, FaUsers } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../middleware/AuthContext";
import { userRequest } from "../../middleware/middleware";
import { Card, Typography } from "@material-tailwind/react";
import Pagination from "../../src/components/Pagination";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loadingUser, setLoadingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers(currentPage);
    }
  }, [isAuthenticated, currentPage]);

  const fetchUsers = async (page) => {
    try {
      const response = await userRequest.get(`/users?page=${page}`);
      setUsers(response.data.users);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const handleMakeAdmin = async (user) => {
    setLoadingUser(user._id);
    try {
      await userRequest.patch(`/users/${user._id}`);
      toast.success(`${user.fullname} is now an admin`);
      fetchUsers(currentPage); // Refresh the user list
    } catch (error) {
      toast.error("Failed to make user admin");
    } finally {
      setLoadingUser(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    setLoadingUser(userId);
    try {
      await userRequest.delete(`/users/${userId}`);
      toast.success("User deleted successfully");
      fetchUsers(currentPage); // Refresh the user list
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setLoadingUser(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex items-center justify-between m-4">
        <h5>All Users</h5>
        <h5>Total Users: {users.length}</h5>
      </div>

      <Card className="h-full w-full overflow-scroll">
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
                  Name
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Email
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  isAdmin
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Action
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className={index % 2 === 0 ? "bg-blue-gray-50/50" : ""}
              >
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
                    {user.fullname}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {user.email}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal capitalize"
                  >
                    {user.isAdmin ? (
                      "true"
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(user)}
                        className="btn btn-circle bg-twitter hover:bg-twitter "
                        disabled={loadingUser === user._id}
                      >
                        <FaUsers />
                      </button>
                    )}
                  </Typography>
                </td>
                <td className="p-4">
                  <button
                    className="btn bg-red hover:bg-red"
                    onClick={() => handleDeleteUser(user._id)}
                    disabled={loadingUser === user._id}
                  >
                    <FaTrashAlt className="text-red-500" />
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

export default Users;
