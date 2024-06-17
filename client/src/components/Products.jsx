import { useEffect, useState } from "react";
import Product from "./Product";
import Pagination from "./Pagination";
import { publicRequest } from "../../middleware/middleware";
import Loading from "./Loading";
import useCart from "../../middleware/useCart";

const Products = ({ categories, filters, sort, isHomePage }) => {
  const { cart, refetch: refetchCart } = useCart();
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
            category: categories,
            page: currentPage,
            limit: 8,
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
  }, [categories, currentPage, filters, sort]);

  useEffect(() => {
    let filteredProductsList = products;

    if (filters) {
      filteredProductsList = filteredProductsList.filter((item) =>
        Object.entries(filters).every(([key, value]) =>
          item[key].toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    if (sort === "asc") {
      filteredProductsList.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      filteredProductsList.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filteredProductsList);
  }, [filters, products, sort]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const noItemsMessage = (
    <div className="container mx-auto mt-5 text-red-500">
      No products available for the selected filters.
    </div>
  );

  return (
    <div className="container px-16 py-18 bg-gray-100 mb-6">
      {loading ? (
        <div className="mt-3">
          <Loading />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : filteredProducts.length === 0 ? (
        noItemsMessage
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-18">
            {filteredProducts.map((item) => (
              <Product
                key={item._id}
                item={item}
                cart={cart}
                onProductAdd={refetchCart}
              />
            ))}
          </div>
          {!isHomePage && totalPages > 1 && (
            <div className="container flex justify-center mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
