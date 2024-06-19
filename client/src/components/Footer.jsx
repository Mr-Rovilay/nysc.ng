import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { CiMail } from "react-icons/ci";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="container py-12 px-6 md:px-20">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1 md:mr-10 mb-6 md:mb-0">
          <h1 className="cursor-pointer py-1.5 font-medium text-green-500 mb-4">
            NYSCKIT.NG
          </h1>
          <p className="mb-4">
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form, by injected
            humour, or randomised words which don’t look even slightly
            believable.
          </p>
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook">
              <FaFacebook className="w-8 h-8 text-blue-600" />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram className="w-8 h-8 text-pink-600" />
            </a>
            <a href="#" aria-label="Twitter">
              <FaXTwitter className="w-8 h-8 " />
            </a>
          </div>
        </div>
        <div className="flex-1">
          <h1 className="py-1.5 font-medium text-green-500 mb-4">Contact</h1>
          <div className="flex items-center mb-4">
            <IoHomeOutline className="w-6 h-6 mr-2" />
            <p className="capitalize">
              14 Akinola Osan Street, Igando Egan, Lagos
            </p>
          </div>
          <div className="flex items-center mb-4">
            <MdOutlinePhoneInTalk className="w-6 h-6 mr-2" />
            <p>+1 234 56 78</p>
          </div>
          <div className="flex items-center mb-4 cursor-pointer">
            <CiMail className="w-6 h-6 mr-2" />
            <a href="mailto:maria@gmail.com">maria@gmail.com</a>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-300 pt-4 text-center text-gray-600">
        &copy; {currentYear} NYSCKIT.NG. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
