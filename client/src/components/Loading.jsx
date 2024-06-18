import { Spinner } from "@material-tailwind/react";

const Loading = ({ text }) => {
  return (
    <div className="">
      <Spinner color="green" className="h-5 w-5" />
      <p>{text}</p>
    </div>
  );
};
export default Loading;
