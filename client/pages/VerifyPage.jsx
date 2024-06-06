import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../src/components/Loading";
import { publicRequest } from "../middleware/middleware";
import { useEffect } from "react";

const VerifyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await publicRequest.post("/orders/verify", {
        success,
        orderId,
      });

      if (response.data.success) {
        navigate("/myOrders");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="min-height-[60vh] grid">
      <div className="mt-3">
        <Loading />
      </div>
    </div>
  );
};

export default VerifyPage;
