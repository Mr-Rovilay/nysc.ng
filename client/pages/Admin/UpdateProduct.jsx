import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input, Textarea, Button, Select } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import { userRequest } from "../../middleware/middleware";
import { uploadImage } from "../../src/common/aws";
import Loading from "../../src/components/Loading";

const UpdateProduct = () => {
  const [product, setProduct] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [size, setSize] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm();
  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await userRequest.get(`/products/${productId}`);
        setProduct(response.data);
        setCategories(response.data.categories);
        setSize(response.data.size);
        reset(response.data);
      } catch (error) {
        console.error("There was an error fetching the product!", error);
        toast.error("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (data.image[0]) {
        const uploadedImageUrl = await uploadImage(data.image[0]);
        if (uploadedImageUrl) {
          data.imageUrl = uploadedImageUrl;
        }
      } else {
        toast.error("Please select an image.");
      }

      const productItem = {
        title: data.title,
        description: data.description,
        image: data.imageUrl,
        categories: categories.map((cat) => cat.value), // Ensure this is an array of values
        size: size.map((sz) => sz.value), // Ensure this is an array of values
        stock: data.stock,
        color: data.color,
        price: parseFloat(data.price),
      };

      const response = await userRequest.put(
        `/products/${productId}`,
        productItem
      );
      toast.success("Product updated successfully!");
      reset();
      navigate("/admin/dashboard/manageProducts");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
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

  const handleSizeChange = (selectedOptions) => {
    setSize(selectedOptions);
  };

  const handleCategoryChange = (selectedOptions) => {
    setCategories(selectedOptions);
  };

  const categoryOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Male & Female", label: "Male & Female" },
  ];

  const sizeOptions = [
    { value: "M", label: "M" },
    { value: "S", label: "S" },
    { value: "XL", label: "XL" },
    { value: "L", label: "L" },
    { value: "XXL", label: "XXL" },
    { value: "Custom", label: "Custom" },
  ];

  if (loading && !product) return <Loading />;

  return (
    <div className="md:w-[870px] mx-auto">
      <ToastContainer />
      <h2 className="text-2xl font-semibold my-4">
        Update <span className="text-green">Product</span>
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
              isMulti
              options={categoryOptions}
              value={categories}
              onChange={handleCategoryChange}
              className="w-full capitalize"
            />
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
              isMulti
              options={sizeOptions}
              value={size}
              onChange={handleSizeChange}
              className="w-full capitalize"
            />
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
              {...register("image")}
              className="file-input w-full max-w-xs bg-black"
            />
            {previewUrl && (
              <div className="mt-4">
                <img src={previewUrl} alt="Preview" className="h-48" />
              </div>
            )}
          </div>
          <Button
            className="btn bg-black text-white hover:bg-dark-green px-6"
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
