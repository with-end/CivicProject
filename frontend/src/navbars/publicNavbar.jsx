import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { clearEmail } from "../store/authSlice";

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const email = useSelector((state) => state.auth.email);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const links = [
    { name: "comeOut", path: "/" },
    { name: "home", path: "/public" },
    { name: "reportIssue", path: "/public/report" },
    { name: "track", path: "/public/track" },
    { name: "history1", path: "/public/history" },
    { name: "notices", path: "/public/notices" },
  ];

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  async function handleGoogleAuth() {
    try {
      navigate("/public/signUp");
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  }

  function handleLogOut() {
    dispatch(clearEmail());
    toast.success("user logged out successfully");
  }

  return (
    <nav className="mx-1 md:mx-0 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16 items-center">
          <div className="text-white font-bold text-xl md:text-2xl">
            {t("civicConnect")}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {links.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`
                    relative font-medium px-3 py-2 rounded-lg transition-all duration-300 transform
                    ${
                      isActive
                        ? "bg-white text-indigo-600 shadow-lg scale-110"
                        : "text-white hover:-translate-y-1 hover:bg-white hover:bg-opacity-20"
                    }
                  `}
                >
                  {t(link.name)}

                  {isActive && (
                    <span className="absolute inset-0 rounded-lg shadow-[0_0_20px_2px_white] pointer-events-none animate-pulse"></span>
                  )}
                </Link>
              );
            })}

            <div className="flex flex-row-reverse items-center">
              <select
                onChange={changeLanguage}
                defaultValue="en"
                className="mt-2 mx-1 w-full border px-2 py-1 rounded bg-white text-indigo-600 font-medium"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="ta">தமிழ்</option>
                <option value="bn">বাংলা</option>
                <option value="ta">ગુજરાતી</option>
                <option value="bn">मराठी</option>
              </select>

              <button
                onClick={email ? handleLogOut : handleGoogleAuth}
                className="
                  px-5 py-1 mt-2
                  rounded
                  font-semibold
                  shadow-lg
                  bg-gradient-to-r
                  hover:from-indigo-500
                  hover:via-pink-500
                  hover:to-yellow-500
                  text-white
                  transition-all duration-300 ease-in-out
                "
              >
                {email ? t("logout") : t("register")}
              </button>
            </div>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none text-2xl"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed right-1 top-16 md:hidden flex items-center justify-center transform transition-transform-opacity duration-500 ease-out ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
      >
        <div className="relative max-w-md bg-white shadow-2xl overflow-hidden">
          <div className="bg-purple-500 min-h-[300px]">
            <div className="border-l border-indigo-200 p-3 flex flex-col">
              {links.map((link) => {
                const isActive = location.pathname === link.path;

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`
                      block px-1 py-1 rounded-lg text-sm font-medium
                      transition-all duration-300 mb-2 text-left
                      ${
                        isActive
                          ? "bg-white text-blue-600 shadow-md"
                          : "text-white hover:bg-white"
                      }
                    `}
                  >
                    {t(link.name)}
                  </Link>
                );
              })}

              <select
                onChange={changeLanguage}
                defaultValue="en"
                className="
                  mt-2
                  w-full
                  border
                  border-indigo-300
                  px-2
                  py-1
                  rounded-lg
                  bg-white
                  text-indigo-600
                  font-medium
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-300
                "
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="ta">தமிழ்</option>
                <option value="bn">বাংলা</option>
                <option value="ta">ગુજરાતી</option>
                <option value="bn">मराठी</option>
              </select>

              <button
                onClick={email ? handleLogOut : handleGoogleAuth}
                className="
                  mt-3
                  w-full
                  px-3
                  py-1
                  rounded-lg
                  bg-indigo-600
                  text-white
                  font-semibold
                  shadow-md
                  hover:bg-indigo-700
                  transition-all
                  duration-300
                "
              >
                {email ? "Log Out" : "Register"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}