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
import { useNavigate, useParams } from "react-router-dom";
import { userRequest } from "../../middleware/middleware";
import { uploadImage } from "../../src/common/aws";
import Loading from "../../src/components/Loading";

const UpdateProduct = () => {
  const [product, setProduct] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [categories, setCategories] = useState("");
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm();
  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await userRequest.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("There was an error fetching the product!", error);
      }
    };
    fetchProduct();
  }, [productId]);

  const onSubmit = async (data) => {
    try {
      if (data.image[0]) {
        const uploadedImageUrl = await uploadImage(data.image[0]);
        if (uploadedImageUrl) {
          data.imageUrl = uploadedImageUrl;
          reset(); // Reset form fields
        }
      } else {
        toast.error("Please select an image.");
      }

      const productItem = {
        title: data.title,
        description: data.description,
        image: data.imageUrl,
        categories: categories,
        size: size,
        stock: data.stock,
        color: data.color,
        price: parseFloat(data.price),
      };

      const response = await userRequest.put(
        `products/${product._id}`,
        productItem
      );
      toast.success("Product updated successfully!");
      reset();
      navigate("/admin/dashboard/manageProducts");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product.");
    } finally {
      setLoading(false);
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

  if (!product)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h2 className="text-2xl font-semibold my-4 text-center">
        Update <span className="text-green-500">Product</span>
      </h2>
      <div className="flex justify-center mt-11">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-lg space-y-6"
        >
          <div className="w-full">
            <label className="label">
              <span className="label-text">Product Title*</span>
            </label>
            <Input
              label="Product title"
              {...register("title", { required: true })}
              className="w-full capitalize"
              defaultValue={product.title}
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
              defaultValue={product.stock}
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
              defaultValue={product.color}
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
              defaultValue={product.price}
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
              defaultValue={product.description}
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
          {previewUrl && (
            <div className="w-full my-4">
              <img src={previewUrl} alt="Preview" className="w-50 h-50" />
            </div>
          )}
          <Button
            className="btn bg-green-500 text-white px-6 mt-2"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span>
                <Loading />
              </span>
            ) : (
              "Update Product"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
