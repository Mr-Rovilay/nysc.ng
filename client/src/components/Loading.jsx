import { Spinner } from "@material-tailwind/react";

const Loading = ({ text }) => {
  return (
    <div className="">
      <Spinner color="green" className="h-6 w-6" />
      <p>{text}</p>
    </div>
  );
};
export default Loading;
