import { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import { userRequest } from "./middleware";

const useCart = () => {
  const { token } = useContext(AuthContext);
  console.log(token);

  const {
    refetch,
    data: cart = {},
    error,
    isError,
  } = useQuery({
    queryKey: ["carts", token],
    queryFn: async () => {
      try {
        const response = await userRequest.get("/carts");
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
      }
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (isError) {
      console.error("Error fetching cart:", error);
    }
  }, [isError, error]);

  return [cart, refetch];
};

export default useCart;
