import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function Signin() {
  const [formData, setFormdata] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormdata({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        // setLoading(false);
        // setError(data.message);
        dispatch(signInFailure(data.message));

        return;
      }
      // setLoading(false);
      // setError(null);
      dispatch(signInSuccess(data));
      navigate("/profile");
    } catch (error) {
      // setError("Server Error: " + error.message);
      // setLoading(false);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="flex flex-col  pt-20 min-h-screen">
      <h1 className="text-center text-orange-500 font-extrabold text-xl sm:text-3xl">
        Sign In
      </h1>
      <form
        className="flex gap-4 flex-col  max-w-xl w-[85%] mx-auto px-4 py-8 shadow-xl rounded-lg text-sm sm:text-base"
        onSubmit={handleSubmit}
      >
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
          className="uppercase p-3 bg-purple-500 mt-4 hover:opacity-80 text-white rounded-lg w-[50%] sm:w-full self-center transition duration-300 ease-in-out transform hover:scale-105"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
        <Link
          to="/signup"
          className="text-xs sm:text-sm pt-4 text-center sm:text-left"
        >
          <p>
            Don&apos;t have an account?{" "}
            <span className="text-blue-500">Sign Up</span>
          </p>
        </Link>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
