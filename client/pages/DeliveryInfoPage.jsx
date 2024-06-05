import { Link } from "react-router-dom";
import Button from "../src/components/Button";
import useCart from "../middleware/useCart";
import { useEffect, useState } from "react";

const DeliveryInfoPage = () => {
  const [cart] = useCart();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = cart.products?.reduce(
        (acc, item) => acc + item.quantity * item.productId.price,
        0
      );
      setTotalPrice(total || 0);
    };
    calculateTotalPrice();
  }, [cart]);

  return (
    <form className="flex flex-col gap-6">
      <div className="w-full max-w-[min(30%,500px)]">
        <p className="text-2xl font-medium mb-12 capitalize my-10">
          delivery information
        </p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="first name"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:outline-tomato"
          />
          <input
            type="text"
            placeholder="last name"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:outline-tomato"
          />
        </div>
        <input
          type="email"
          placeholder="email"
          className="w-full p-2 mb-4 border border-gray-300 rounded outline-none focus:outline-tomato"
        />
        <input
          type="text"
          placeholder="street"
          className="w-full p-2 mb-4 border border-gray-700 rounded outline-none focus:outline-tomato"
        />
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="city"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:outline-tomato"
          />
          <input
            type="text"
            placeholder="state"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:outline-tomato"
          />
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="zipcode"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:outline-tomato"
          />
          <input
            type="text"
            placeholder="country"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:outline-tomato"
          />
        </div>
        <input
          type="number"
          placeholder="phone"
          className="w-full p-2 mb-4 border border-gray-300 rounded outline-none focus:outline-tomato"
        />
      </div>
      <div className="w-full max-w-[min(40%,500px)]">
        <div className="flex flex-end">
          <div className="md:w-1/2 space-y-3">
            <h3 className="text-lg font-semibold">Shopping Details</h3>
            <p>Total Items: {cart.products?.length || 0}</p>
            <p>
              Delivery Price:{" "}
              <span id="total-price">${totalPrice === 0 ? 0 : 20}</span>
            </p>
            <p>
              Total Price:{" "}
              <span id="total-price">$ {totalPrice.toFixed(2)}</span>
            </p>
            <Link to="/payment">
              <div className="mt-4">
                <Button variant="secondary" text={"proceed to payment"} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DeliveryInfoPage;
