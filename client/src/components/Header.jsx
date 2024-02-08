import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSelector } from "react-redux";
import { BiSolidHomeHeart } from "react-icons/bi";
import { Link, useNavigate, useLocation } from "react-router-dom";
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setsearchTerm] = useState("");
  const [burgerClick, setBurgerClick] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setsearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleBurgerClick = () => {
    setBurgerClick(!burgerClick);
  };
  return (
    <header className="  bg-slate-100 ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        <Link
          to="/"
          className="flex items-center text-md sm:text-lg md:text-3xl text-red-600"
        >
          <BiSolidHomeHeart className="text-md sm:text-2xl md:text-2xl lg:text-3xl" />
          <h1 className="text-xl sm:text-3xl lg:text-4xl flex ">
            <span
              className="
          text-slate-600 font-semibold uppercase "
            >
              Surrealty
            </span>
            <span className="text-slate-400 uppercase font-extralight">
              Estates
            </span>
          </h1>
        </Link>
        <form
          className="bg-slate-100 rounded-lg p-3 flex items-center gap-2"
          onSubmit={handleSubmit}
        >
          <input
            type="search"
            id=""
            placeholder="Search listings..."
            className="bg-transparent focus:outline-none w-24 sm:w-44 lg:w-64 text-slate-500 text-xs border p-3 rounded-lg"
            onChange={(e) => setsearchTerm(e.target.value)}
            value={searchTerm}
          />
          <FaSearch
            className="text-slate-500 cursor-pointer hidden lg:block"
            onClick={handleSubmit}
          />
        </form>
        <nav>
          <ul className="flex items-center gap-4 text-slate-500 text-xs lg:text-base font-light">
            <div className="relative">
              <RxHamburgerMenu
                className="md:hidden block text-lg hover:cursor-pointer"
                onClick={handleBurgerClick}
              />
              {burgerClick && (
                <div className="flex flex-col absolute z-10 md:hidden bg-white shadow-lg p-2 mt-1 pb-4 rounded-sm">
                  <ul className="flex flex-col gap-4 w-[50px] items-center mt-2 whitespace-nowrap">
                    <Link to="/" onClick={() => setBurgerClick(false)}>
                      <li className="hover:underline hover:text-red-600">
                        Home
                      </li>
                    </Link>
                    <Link to="/about" onClick={() => setBurgerClick(false)}>
                      <li className="hover:underline hover:text-red-600">
                        About
                      </li>
                    </Link>
                    {currentUser ? (
                      <Link to="/profile" onClick={() => setBurgerClick(false)}>
                        <img
                          src={currentUser.photo}
                          alt="user-photo"
                          className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover "
                        />
                      </Link>
                    ) : (
                      <Link to="/signin" onClick={() => setBurgerClick(false)}>
                        <li className="  hover:underline hover:text-red-600">
                          Sign In
                        </li>
                      </Link>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <Link to="/">
              <li className="hidden md:inline hover:underline hover:text-red-600">
                Home
              </li>
            </Link>
            <Link to="/about">
              <li className="hidden md:inline hover:underline hover:text-red-600">
                About
              </li>
            </Link>
            {currentUser ? (
              <Link to="/profile">
                <img
                  src={currentUser.photo}
                  alt="user-photo"
                  className="hidden md:block w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover "
                />
              </Link>
            ) : (
              <Link to="/signin">
                <li className="hidden md:block  hover:underline hover:text-red-600">
                  Sign In
                </li>
              </Link>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
