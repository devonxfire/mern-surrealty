import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [formData, setFormdata] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormdata({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        console.log("from the if");
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/signin");
    } catch (error) {
      setError("Server Error: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col  pt-20 min-h-screen">
      <h1 className="text-center text-orange-500 font-extrabold text-xl sm:text-3xl">
        Sign Up
      </h1>
      <form
        className="flex gap-4 flex-col  max-w-xl w-[85%] mx-auto px-4 py-8 shadow-xl rounded-lg text-sm sm:text-base"
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
          className="uppercase p-3 bg-purple-500 mt-4 font-bold hover:opacity-80 text-white rounded-lg w-[50%] sm:w-full self-center"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <Link
          to="/signin"
          className="text-xs sm:text-sm pt-4 text-center sm:text-left"
        >
          <p>
            Have an account? <span className="text-blue-500">Sign Up</span>
          </p>
        </Link>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
