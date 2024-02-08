import React from "react";
import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  signInSuccess,
  signInStart,
  signInFailure,
  reset,
} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      dispatch(reset());

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
      navigate("/profile");
    } catch (error) {
      console.log("Could not continue with Google", error);
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className="flex items-center justify-center max-w-xl mx-auto w-full px-4 bg-white">
      <button
        className="uppercase font-bold p-3 bg-zinc-700 hover:opacity-80 text-white w-full self-center transition duration-300 ease-in-out transform hover:scale-105 text-sm"
        onClick={handleGoogleClick}
      >
        <div className="flex items-center justify-center gap-2">
          <FaGoogle className="text-red-700" />
          Continue with Google
        </div>
      </button>
    </div>
  );
}
