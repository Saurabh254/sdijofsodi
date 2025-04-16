import { RiContactsLine, RiLogoutBoxLine } from "@remixicon/react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="z-10">
      <nav className="fixed z-5 w-full bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-end items-center mx-auto max-w-screen-xl">
          <div className="flex items-center ">
            <a href="#" className="flex items-center gap-2 text-white text-sm ">
              <RiContactsLine className="w-5" /> Contact Administration
            </a>
            <Link
              to="/login"
              className="text-gray-800 dark:text-white hover:bg-gray-50 bg-gray-700 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 flex items-center gap-2 justify-center ml-4"
            >
              <RiLogoutBoxLine className="w-4" /> Logout
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
