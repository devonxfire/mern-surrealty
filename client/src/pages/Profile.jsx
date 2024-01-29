import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const handleChange = (e) => {
    setFormdata({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        return;
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col  pt-20 min-h-screen">
      <h1 className="text-center text-orange-500 font-extrabold text-xl sm:text-3xl">
        My Profile
      </h1>
      <form
        className="flex gap-4 flex-col  max-w-xl w-[85%] mx-auto px-4 py-8 shadow-xl rounded-lg text-sm sm:text-base"
        onSubmit={handleSubmit}
      >
        <img
          src={currentUser.photo}
          className="w-12 h-12 sm:w-24 sm:h-24 rounded-full self-center cursor-pointer"
          alt="photo"
        />
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="p-3 focus:outline-none  border rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="p-3 focus:outline-none  border rounded-lg"
          onChange={handleChange}
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="p-3 focus:outline-none border rounded-lg"
          onChange={handleChange}
          defaultValue="********"
        />
        <button className="uppercase p-3 bg-purple-500 mt-4  hover:opacity-80 text-white rounded-lg w-[50%] sm:w-full self-center transition duration-300 ease-in-out transform hover:scale-105">
          UPDATE
        </button>

        <Link
          to="/signin"
          className="text-xs sm:text-sm pt-4 text-center sm:text-left"
        >
          <p className="flex justify-between">
            <span className="text-red-500">Delete Account</span>
            <span className="text-blue-500">Sign Out</span>
          </p>
        </Link>
      </form>
    </div>
  );
}
