import { useEffect, useState } from "react";
import Product from "./Product";
import Pagination from "./Pagination";
import { publicRequest } from "../../middleware/middleware";
import Loading from "./Loading";

const Products = ({ category, filters, sort }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await publicRequest.get("/products", {
          params: {
            category: category,
            page: currentPage,
            limit: 8,
            sort,
            new: filters ? "true" : "false",
          },
        });

        setProducts(res.data.products);
        setTotalPages(res.data.pagination.totalPages);
      } catch (error) {
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [category, currentPage, filters, sort]);

  useEffect(() => {
    if (filters) {
      setFilteredProducts(
        products.filter((item) =>
          Object.entries(filters).every(([key, value]) =>
            item[key].includes(value)
          )
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [filters, products]);

  useEffect(() => {
    if (sort === "asc") {
      setFilteredProducts(
        [...filteredProducts].sort((a, b) => a.price - b.price)
      );
    } else if (sort === "desc") {
      setFilteredProducts(
        [...filteredProducts].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort, filteredProducts]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container px-16 py-8 bg-gray-100 mb-6">
      {loading ? (
        <div className="mt-3">
          <Loading />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((item) => (
              <Product key={item._id} item={item} />
            ))}
          </div>
          <div className="container flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
