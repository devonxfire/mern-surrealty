import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  reset,
} from "../redux/user/userSlice";

import OAuth from "../components/OAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [formData, setFormdata] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormdata({ ...formData, [e.target.id]: e.target.value });
  };

  const showToastOnError = (error) => {
    if (error) {
      const screenWidth = window.innerWidth;

      const toastPosition = screenWidth >= 768 ? "top-right" : "bottom-center";

      toast.error(error, {
        position: toastPosition,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(reset());
      dispatch(signInStart());
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        showToastOnError(data.message);

        return;
      }

      dispatch(signInSuccess(data));
      navigate("/signin");
    } catch (error) {
      dispatch(signInFailure(error.message));
      showToastOnError(error.message);
    }
  };

  return (
    <div className="flex flex-col  pt-20  min-h-screen bg-gradient-to-r from-white to-slate-300">
      <h1 className="text-center bg-gradient-to-r text-slate-600 font-bold text-xl sm:text-3xl">
        Sign Up
      </h1>

      {/* extra div */}
      <div className="shadow-xl max-w-xl w-[85%] mx-auto bg-white mt-8 rounded-lg ">
        <form
          className="flex gap-4 flex-col   px-4 rounded-t-lg mt-8  text-sm sm:text-base text-slate-500 bg-white"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            id="username"
            placeholder="Username"
            className="p-3 focus:outline-none  border rounded-lg"
            onChange={handleChange}
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="p-3 focus:outline-none  border rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="p-3 focus:outline-none border rounded-lg"
            onChange={handleChange}
          />
          <button
            className="uppercase font-bold p-3 bg-red-700 hover:opacity-80 text-white text-sm w-full self-center transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>

          <ToastContainer />
        </form>
        <OAuth formData={formData} />
        <Link to="/signin" className="text-sms  pt-4 text-center sm:text-left">
          <p className="text-slate-500 px-4 py-8 bg-white rounded-b-lg">
            Have an account? <span className="text-blue-500">Sign In</span>
          </p>
        </Link>
      </div>
    </div>
  );
}
