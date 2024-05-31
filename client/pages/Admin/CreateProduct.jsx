import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Input,
  Textarea,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { userRequest } from "../../middleware/middleware";
import { uploadImage } from "../../src/common/aws";

const CreateProduct = () => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [categories, setCategories] = useState("");
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      if (data.image[0]) {
        const uploadedImageUrl = await uploadImage(data.image[0]);
        if (uploadedImageUrl) {
          data.imageUrl = uploadedImageUrl;
          toast.success("image added successfully!");
          reset(); // Reset form fields
        }
      } else {
        toast.error("Please select an image.");
      }

      const productItem = {
        title: data.title,
        description: data.description,
        image: data.imageUrl,
        categories: categories, // Ensure this is an array
        size: size, // Ensure this is an array
        stock: data.stock,
        color: data.color,
        price: parseFloat(data.price),
      };

      console.log(productItem);

      const response = await userRequest.post("/products", productItem);
      console.log(response.data);
      toast.success("Product added successfully!");
      reset();
      navigate("/dashboard/manage-products");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product.");
    } finally {
      setLoading(false); // Set loading state to false regardless of success or failure
    }
  };

  const imageFile = watch("image");
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(imageFile[0]);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const handleSizeChange = (value) => {
    setSize(value);
  };
  const handleCategoryChange = (value) => {
    setCategories(value);
  };

  return (
    <div className="md:w-[870px] mx-auto ">
      <ToastContainer />
      <h2 className="text-2xl font-semibold my-4">
        Upload A New <span className="text-green">Product</span>
      </h2>
      <div className="flex items-center justify-center mt-11">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="w-full">
            <label className="label">
              <span className="label-text">Product Title*</span>
            </label>
            <Input
              label="Product title"
              {...register("title", { required: true })}
              className="w-full capitalize"
            />
          </div>
          <div className="w-full">
            <label className="label">
              <span className="label-text">Categories*</span>
            </label>
            <Select
              label="Categories"
              value={categories}
              onChange={(value) => handleCategoryChange(value)}
              className="w-full capitalize"
            >
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Male & Female">Male & Female</Option>
            </Select>
          </div>
          <div className="w-full">
            <label className="label">
              <span className="label-text">Stock*</span>
            </label>
            <Input
              label="Stock"
              type="number"
              {...register("stock", { required: true })}
              className="w-full"
            />
          </div>
          <div className="w-full">
            <label className="label">
              <span className="label-text">Color*</span>
            </label>
            <Input
              label="Color"
              type="text"
              {...register("color", { required: true })}
              className="w-full"
            />
          </div>
          <div className="w-full">
            <label className="label">
              <span className="label-text">Size*</span>
            </label>
            <Select
              label="Size"
              value={size}
              onChange={(value) => handleSizeChange(value)}
              className="w-full capitalize"
            >
              <Option value="M">M</Option>
              <Option value="S">S</Option>
              <Option value="XL">XL</Option>
              <Option value="L">L</Option>
              <Option value="XXL">XXL</Option>
              <Option value="Custom">Custom</Option>
            </Select>
          </div>
          <div className="w-full">
            <label className="label">
              <span className="label-text">Price*</span>
            </label>
            <Input
              label="Price"
              type="number"
              {...register("price", { required: true })}
              className="w-full"
            />
          </div>
          <div className="w-full">
            <label className="label">
              <span className="label-text">Product Description*</span>
            </label>
            <Textarea
              variant="standard"
              placeholder="Product description"
              rows={4}
              {...register("description", { required: true })}
              className="w-full"
            />
          </div>
          <div className="w-full my-6">
            <Input
              label="Upload Image"
              type="file"
              {...register("image", { required: true })}
              className="file-input w-full max-w-xs bg-black"
            />
          </div>
          <Button
            className="btn bg-black text-white hover:bg-dark-green px-6"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <Button loading={true}>Loading</Button>
            ) : (
              "Create Product"
            )}{" "}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
