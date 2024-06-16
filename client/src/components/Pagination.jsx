import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getItemProps = (index) => ({
    variant: currentPage === index ? "filled" : "text",
    color: "gray",
    onClick: () => onPageChange(index),
  });

  const next = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const prev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-2">
      <Button
        variant="text"
        className={`flex items-center gap-2 ${
          currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-green-500"
        }`}
        onClick={prev}
        disabled={currentPage === 1}
        size="sm"
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
      </Button>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <IconButton
            key={i}
            className={`${
              currentPage === i + 1 ? "bg-green-700" : "bg-green-500"
            }`}
            {...getItemProps(i + 1)}
            size="sm"
          >
            {i + 1}
          </IconButton>
        ))}
      </div>
      <Button
        variant="text"
        className={`flex items-center gap-2 ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-green-500"
        }`}
        onClick={next}
        disabled={currentPage === totalPages}
        size="sm"
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
