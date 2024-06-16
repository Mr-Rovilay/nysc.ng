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
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await publicRequest.get(
          `/products?search=${searchQuery}`
        );
        setResults(response.data.products);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
      setLoading(false);
    };

    if (searchQuery) {
      fetchResults();
    }
  }, [searchQuery]);

  return (
    <div className="container">
      <h1>Search Results for "{searchQuery}"</h1>
      {loading ? (
        <Loading />
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
        </div>
      ) : (
        <p>No results found for "{searchQuery}".</p>
      )}
    </div>
  );
};

export default SearchResults;
