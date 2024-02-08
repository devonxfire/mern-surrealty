import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
  reset,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signin() {
  const [formData, setFormdata] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormdata({ ...formData, [e.target.id]: e.target.value });
  };

  console.log(formData);

  const showToastOnError = (error) => {
    if (error) {
      toast.error(error, {
        position: "top-right",
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
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        showToastOnError(data.message);

        return;
      }

      dispatch(signInSuccess(data));
      navigate("/profile");
    } catch (error) {
      dispatch(signInFailure(error.message));
      showToastOnError(error.message);
    }
  };

  return (
    <div className="flex flex-col mt-20 min-h-screen">
      <h1 className="text-center text-slate-500 font-extrabold text-xl sm:text-3xl">
        Sign In
      </h1>

      {/* extra div */}
      <div className="shadow-xl rounded-lg max-w-xl w-[85%] mx-auto ">
        <form
          className="flex gap-4 flex-col pt-8  px-4   text-sm sm:text-base"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="p-3 focus:outline-none  border rounded-lg text-slate-500"
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="p-3 focus:outline-none border rounded-lg text-slate-500"
            onChange={handleChange}
          />
          <button
            className="uppercase font-bold p-3 bg-red-600 hover:opacity-80 text-white w-full self-center transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>

          <ToastContainer />
        </form>
        <OAuth />

        <Link
          to="/signup"
          className="text-xs sm:text-sm pt-4 text-center sm:text-left"
        >
          <p className="text-slate-500 px-4 py-8 ">
            Don&apos;t have an account?{" "}
            <span className="text-blue-500">Sign Up</span>
          </p>
        </Link>
      </div>
    </div>
  );
}
