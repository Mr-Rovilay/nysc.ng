import { useEffect, useState } from "react";
import axios from "axios";
import Product from "./Product"; // Assuming you have a Product component
import { url } from "../App";

const Products = ({ cat, filters, sort }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(url + "/products", {
          params: {
            category: cat,
            page: currentPage,
            limit: 10, // You can adjust this or make it dynamic
            sort,
            new: filters.new ? "true" : "false", // Example of passing filter
          },
        });

        setProducts(res.data.products);
        setTotalPages(res.data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [cat, currentPage, filters, sort]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="px-16 py-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        products.map((item) => <Product key={item._id} item={item} />)
      )}

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Products;
