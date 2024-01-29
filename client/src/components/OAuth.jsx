import React from "react";
import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess, signInStart } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      dispatch(signInStart());
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("Could not continue with Google", error);
    }
  };
  return (
    <div className="flex items-center justify-center">
      <button
        className="uppercase p-3 hover:opacity-80 text-slate-500 font-medium border rounded-lg w-[50%] sm:w-full self-center transition duration-300 ease-in-out transform hover:scale-105 text-[10px] sm:text-base"
        onClick={handleGoogleClick}
      >
        <div className="flex items-center justify-center gap-2">
          <FaGoogle className="text-orange-500" />
          Continue with Google
        </div>
      </button>
    </div>
  );
}
