import Button from "./Button";

const CategoryItem = ({ item }) => {
  return (
    <div className="flex-1 m-1 h-[70vh] relative">
      <img
        src={item.img}
        alt={item.title}
        className="w-full h-full object-cover md:h-[70vh] sm:h-[20vh]"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-white mb-5">{item.title}</h1>
        <Button text={"shop now"} variant="primary" className={"bg-white"} />
      </div>
    </div>
  );
};

export default CategoryItem;
