import { Link } from "react-router-dom";
import Button from "../src/components/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useCart from "../middleware/useCart";
import { useEffect, useState } from "react";
import { userRequest } from "../middleware/middleware";

const DeliveryInfoPage = () => {
  const [cart] = useCart();
  const [subTotal, setSubTotal] = useState(0);
  const deliveryPrice = 20;
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const calculateSubTotal = () => {
      const total = cart.products?.reduce(
        (acc, item) => acc + item.quantity * item.productId.price,
        0
      );
      setSubTotal(total || 0);
    };
    calculateSubTotal();
  }, [cart]);

  useEffect(() => {
    setTotalPrice(subTotal + deliveryPrice);
  }, [subTotal]);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    const orderItems = cart.products?.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const orderData = {
      address: data,
      products: orderItems,
      amount: totalPrice,
    };

    console.log("Order Data: ", orderData); // Log for debugging

    try {
      const response = await userRequest.post("/orders", orderData);
      console.log(response);

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        toast.error("Error occurred while placing order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("An error occurred while placing order");
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={placeOrder}>
      <ToastContainer />
      <div className="w-full max-w-[min(30%,500px)]">
        <p className="text-2xl font-medium mb-12 capitalize my-10">
          Delivery Information
        </p>
        <div className="flex gap-2 mb-4">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:outline-tomato"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:outline-tomato"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border border-gray-300 rounded outline-none focus:outline-tomato"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
          className="w-full p-2 mb-4 border border-gray-300 rounded outline-none focus:outline-tomato"
        />
        <div className="flex gap-2 mb-4">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:outline-tomato"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:outline-tomato"
          />
        </div>
        <div className="flex gap-2 mb-4">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zipcode"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:outline-tomato"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:outline-tomato"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="number"
          placeholder="Phone"
          className="w-full p-2 mb-4 border border-gray-300 rounded outline-none focus:outline-tomato"
        />
      </div>
      <div className="w-full max-w-[min(40%,500px)]">
        <div className="flex flex-end">
          <div className="md:w-1/2 space-y-3">
            <h3 className="text-lg font-semibold">Shopping Details</h3>
            <p>Total Items: {cart.products?.length || 0}</p>
            <p>
              Sub Total: <span id="total-price">$ {subTotal.toFixed(2)}</span>
            </p>
            <p>
              Delivery Price:{" "}
              <span id="delivery-price">
                ${subTotal === 0 ? 0 : deliveryPrice}
              </span>
            </p>
            <p>
              Total Price:{" "}
              <span id="total-price">
                $ {(subTotal + deliveryPrice).toFixed(2)}
              </span>
            </p>

            <div className="mt-4">
              <Button
                variant="secondary"
                text={"Proceed to Payment"}
                type={"submit"}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DeliveryInfoPage;
