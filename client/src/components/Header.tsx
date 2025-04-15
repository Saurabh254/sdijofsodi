import { RiContactsLine, RiLogoutBoxLine } from "@remixicon/react";

const Header = () => {
  return (
    <header className="z-10">
      <nav className="fixed z-5 w-full bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="#" className="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Welcome!
            </span>
          </a>
          <div className="flex items-center ">
            <a href="#" className="flex items-center gap-2 text-white text-sm ">
              <RiContactsLine className="w-5" /> Contact Administration
            </a>
            <a
              href="/login"
              className="text-gray-800 dark:text-white hover:bg-gray-50 bg-gray-700 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 flex items-center gap-2 justify-center ml-4"
            >
              <RiLogoutBoxLine className="w-4" /> Logout
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
