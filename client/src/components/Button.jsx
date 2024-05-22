import PropTypes from "prop-types";

const Button = ({ text, variant, className }) => {
  const baseStyles =
    "focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 cursor-pointer";
  const variantStyles = {
    primary: "bg-gray text-black hover:bg-gray-100 focus:ring-gray-300",
    secondary:
      "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 cursor-pointer",
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"]).isRequired,
  className: PropTypes.string,
};

export default Button;
