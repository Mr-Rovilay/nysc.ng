import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { publicRequest } from "../middleware/middleware";
import Loading from "../src/components/Loading";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const query = useQuery();
  const searchQuery = query.get("query");
  const pageQuery = query.get("page") || 1;
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await publicRequest.get(
          `/products?search=${searchQuery}&page=${pageQuery}&limit=10`
        );
        setResults(response.data.products);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
      setLoading(false);
    };

    if (searchQuery) {
      fetchResults();
    }
  }, [searchQuery, pageQuery]);

  const handlePageChange = (pageNumber) => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("query", searchQuery);
    params.append("page", pageNumber);
    window.location.search = params.toString();
  };

  return (
    <div>
      <h1>Search Results for "{searchQuery}"</h1>
      {loading ? (
        <p>
          <Loading />
        </p>
      ) : results.length > 0 ? (
        <div>
          <ul>
            {results.map((product) => (
              <li key={product._id}>
                <Link to={`/product/${product._id}`}>
                  {product.title} - ${product.price}
                </Link>
              </li>
            ))}
          </ul>
          <div>
            {Array.from({ length: pagination.totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                disabled={pagination.currentPage === index + 1}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
