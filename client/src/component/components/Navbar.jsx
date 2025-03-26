import { useState } from "react";
import { auth } from "../../firebase/Firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router";

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("userId");
      navigate("/");
    });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Fixed and Transparent Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-md shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/homepage" className="text-black font-bold text-xl">
                Learning Languages
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-baseline space-x-4">
                <a
                  href="#"
                  onClick={() => navigate("/homepage")}
                  className="text-black hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </a>
                <a
                  href="#"
                  onClick={() => navigate("/about-us")}
                  className="text-black hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  About Us
                </a>
                <a
                  href="#"
                  onClick={() => navigate("/contact-us")}
                  className="text-black hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact Us
                </a>
                <a
                  href="#"
                  onClick={() => navigate("/profile")}
                  className="text-black hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile Page
                </a>
                <a
                  href="#"
                  onClick={handleSignOut}
                  className="text-black hover:bg-red-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="bg-gray-200 inline-flex items-center justify-center p-2 rounded-md text-black hover:bg-gray-300 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-gray-100 bg-opacity-90`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#"
              onClick={() => navigate("/homepage")}
              className="text-black block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </a>
            <a
              href="#"
              onClick={() => navigate("/about-us")}
              className="text-black block px-3 py-2 rounded-md text-base font-medium"
            >
              About Us
            </a>
            <a
              href="#"
              onClick={() => navigate("/contact-us")}
              className="text-black block px-3 py-2 rounded-md text-base font-medium"
            >
              Contact Us
            </a>
            <a
              href="#"
              onClick={() => navigate("/profile")}
              className="text-black block px-3 py-2 rounded-md text-base font-medium"
            >
              Profile
            </a>
            <a
              href="#"
              onClick={handleSignOut}
              className="text-black hover:bg-red-300 block px-3 py-2 rounded-md text-base font-medium"
            >
              Logout
            </a>
          </div>
        </div>
      </nav>

      {/* Padding to prevent content overlap */}
      <div className="pt-16"></div>
    </>
  );
}

export default Navbar;
