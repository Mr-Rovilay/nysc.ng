import { useNavigate, useSearchParams } from "react-router-dom";
import { publicRequest } from "../middleware/middleware";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../src/components/Loading";

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();

  const verifyPayment = async () => {
    console.log("Starting payment verification...");
    try {
      const response = await publicRequest.post("/orders/verify", {
        success,
        orderId,
      });

      console.log("Verification response:", response.data);

      if (response.data.success) {
        console.log("Verification successful, navigating to /myOrders");
        navigate("/myOrders");
      } else {
        toast.error("Order verification failed");
        navigate("/");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error("Payment verification failed");
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="min-height-[60vh] grid">
      <ToastContainer />
      <div className="mt-3">
        <Loading />
      </div>
    </div>
  );
};

export default VerifyPage;
