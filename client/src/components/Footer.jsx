import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { CiMail } from "react-icons/ci";

const Footer = () => {
  return (
    <div className="flex flex-col md:flex-row bg-gray-100 py-12 px-6 md:px-20">
      <div className="flex-1 md:mr-10">
        <h1 className="text-2xl font-bold mb-4 italic uppercase text-green-500">
          NYSCkit.NG
        </h1>
        <p className="mb-4">
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration in some form, by injected
          humour, or randomised words which don’t look even slightly believable.
        </p>
        <div className="flex">
          <a href="#" className="mr-4">
            <FaFacebook className="w-8 h-8 text-blue-600" />
          </a>
          <a href="#" className="mr-4">
            <FaInstagram className="w-8 h-8 text-pink-600" />
          </a>
          <a href="#" className="mr-4">
            <FaXTwitter className="w-8 h-8 text-blue-400" />
          </a>
        </div>
      </div>
      <div className="flex-1 md:mr-10 mt-6 md:mt-0">
        <h3 className="text-xl font-semibold mb-4">Useful Links</h3>
        <ul className="list-none">
          <li className="mb-2">
            <a href="#">Home</a>
          </li>
          <li className="mb-2">
            <a href="#">Cart</a>
          </li>
          <li className="mb-2">
            <a href="#">Man Fashion</a>
          </li>
          <li className="mb-2">
            <a href="#">Woman Fashion</a>
          </li>
          <li className="mb-2">
            <a href="#">Accessories</a>
          </li>
          <li className="mb-2">
            <a href="#">My Account</a>
          </li>
          <li className="mb-2">
            <a href="#">Order Tracking</a>
          </li>
          <li className="mb-2">
            <a href="#">Wishlist</a>
          </li>
          <li>
            <a href="#">Terms</a>
          </li>
        </ul>
      </div>
      <div className="flex-1 mt-6 md:mt-0">
        <h3 className="text-xl font-semibold mb-4">Contact</h3>
        <div className="flex items-center mb-4">
          <IoHomeOutline className="w-6 h-6 mr-2" />
          <p>622 Dixie Path, South Tobinchester 98336</p>
        </div>
        <div className="flex items-center mb-4">
          <MdOutlinePhoneInTalk className="w-6 h-6 mr-2" />
          <p>+1 234 56 78</p>
        </div>
        <div className="flex items-center mb-4">
          <CiMail className="w-6 h-6 mr-2" />
          <p>contact@lama.dev</p>
        </div>
        <img
          src="https://i.ibb.co/Qfvn4z6/payment.png"
          alt="Payment"
          className="w-1/2"
        />
      </div>
    </div>
  );
};

export default Footer;
