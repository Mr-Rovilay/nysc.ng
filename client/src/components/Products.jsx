import { popularProducts } from "../data";
import Product from "./Product";

const Products = () => {
  return (
    <div className="px-16 py-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {popularProducts.map((item) => (
        <Product key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Products;
