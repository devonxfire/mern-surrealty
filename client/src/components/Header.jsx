import React from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="border-b  bg-white ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        <Link to="/">
          <h1 className="text-xl sm:text-3xl lg:text-4xl flex flex-wrap">
            <span
              className="
          text-red-600 font-bold"
            >
              Surrealty
            </span>
            <span className="text-slate-500 ">Estates</span>
          </h1>
        </Link>
        <form className="bg-slate-100 rounded-lg p-3 flex items-center gap-2">
          <input
            type="search"
            id=""
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-44 lg:w-64 text-slate-500"
          />
          <FaSearch className="text-slate-500 " />
        </form>
        <nav>
          <ul className="flex items-center gap-4 text-slate-500 text-xs lg:text-base font-light">
            <Link to="/">
              <li className="hidden sm:inline hover:underline hover:text-red-600">
                Home
              </li>
            </Link>
            <Link to="/about">
              <li className="hidden sm:inline hover:underline hover:text-red-600">
                About
              </li>
            </Link>
            {currentUser ? (
              <Link to="/profile">
                <img
                  src={currentUser.photo}
                  alt="user-photo"
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover "
                />
              </Link>
            ) : (
              <Link to="/signin">
                <li className="  hover:underline hover:text-red-600">
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
