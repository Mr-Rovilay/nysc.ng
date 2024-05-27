import { useEffect, useState } from "react";
import Product from "./Product";
import Pagination from "./Pagination";
import { publicRequest } from "../middleware";

const Products = ({ cat, filters, sort }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const res = await publicRequest.get("/products", {
          params: {
            category: cat,
            page: currentPage,
            limit: 10,
            sort,
            new: filters ? "true" : "false",
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="px-16 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <p>Loading...</p>
        ) : cat ? (
          filteredProducts.map((item) => <Product key={item._id} item={item} />)
        ) : (
          products
            .slice(0, 8)
            .map((item) => <Product key={item._id} item={item} />)
        )}
      </div>

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

export default Products;
