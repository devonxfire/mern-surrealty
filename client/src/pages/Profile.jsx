import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/user/userSlice";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

  const [formData, setFormdata] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [listings, setListings] = useState([]);
  const dispatch = useDispatch();

  console.log(currentUser.username, currentUser.email, currentUser.photo);
  console.log(formData);

  // Toasts
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

  const showToastOnSucces = (data) => {
    if (data) {
      const screenWidth = window.innerWidth;

      const toastPosition = screenWidth >= 768 ? "top-right" : "bottom-center";

      toast.success(data, {
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

  const handleChange = (e) => {
    setFormdata({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // View my listings functionality
  useEffect(() => {
    try {
      const fetchMyListings = async () => {
        const res = await fetch(`api/users/listings/${currentUser._id}`);
        const data = await res.json();
        setListings(data);
      };
      fetchMyListings();
    } catch (error) {
      console.log(error);
      showToastOnError(error.message);
    }
  }, []);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        showToastOnError(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormdata({ ...formData, photo: downloadURL });
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateStart());
      setIsLoading(true);
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        console.log("Update failed:", data.message);

        dispatch(updateFailure(data.message));
        setIsLoading(false);
        showToastOnError(data.message);
        return;
      }
      dispatch(updateSuccess(data));
      setIsLoading(false);
      setIsSuccess(true);
      showToastOnSucces("Profile updated successfully!");
    } catch (error) {
      dispatch(updateFailure(error.message));
      setIsLoading(false);
      showToastOnError(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteStart());
      const res = await fetch(`api/users/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = res.json();

      if (data.success === false) {
        dispatch(deleteFailure(data.message));
        return;
      }
      dispatch(deleteSuccess());
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signoutStart());
      const res = await fetch("/api/auth/signout");
      const data = res.json();
      if (data.success === false) {
        dispatch(signoutFailure(data.message));
        return;
      }
      dispatch(signoutSuccess());
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  };

  return (
    <div className="flex flex-col  pt-12 min-h-screen bg-gradient-to-r from-white to-slate-300">
      <h1 className="text-center bg-gradient-to-r text-slate-600 font-bold text-xl sm:text-3xl">
        My Profile
      </h1>
      <form
        className="flex gap-4 flex-col  max-w-xl w-[85%] mx-auto px-4 py-8 shadow-xl rounded-lg text-sm sm:text-base bg-white mt-6"
        onSubmit={handleSubmit}
      >
        <img
          src={formData.photo || currentUser.photo}
          className="w-12 h-12 sm:w-24 sm:h-24 rounded-full self-center cursor-pointer object-cover "
          alt="photo"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-center sm:text-xs text-[0.6rem] text-slate-400">
          Click image to update profile pic
        </p>

        <input
          className="sm:text-sm text:xs justify-center"
          hidden
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <p className="text-sm text-center">
          {fileUploadError ? (
            <span className="text-red-500">Error image upload</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-blue-500">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-500">
              Success! Please click 'Save changes'
            </span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          id="username"
          placeholder="Username"
          className="p-3 focus:outline-none  border rounded-lg text-slate-500"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="p-3 focus:outline-none  border rounded-lg text-slate-500"
          onChange={handleChange}
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="p-3 focus:outline-none border rounded-lg text-slate-500"
          onChange={handleChange}
        />
        <button
          className="uppercase font-bold p-3 bg-slate-500 hover:opacity-80 text-white w-[80%] self-center  transition duration-300 ease-in-out transform hover:scale-105 mt-4 text-xs"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "save changes"}
        </button>

        <Link to="/my-listings" className="w-full text-center">
          <button
            className="uppercase font-bold p-3 bg-slate-700 hover:opacity-80 text-white w-[80%]  transition duration-300 ease-in-out transform hover:scale-105 text-xs"
            disabled={isLoading}
          >
            view my listings
          </button>
        </Link>
        <Link to="/create-listing" className="w-full text-center  ">
          <button
            className="uppercase font-bold p-3 bg-red-700 hover:opacity-80 text-white w-[80%] transition duration-300 ease-in-out transform hover:scale-105 text-xs whitespace-nowrap"
            disabled={isLoading}
          >
            + Create a new Listing
          </button>
        </Link>
        <Link to="/signin" className="text-sm  pt-4 text-center sm:text-left">
          <p className="flex justify-between">
            <span className="text-red-500" onClick={handleDelete}>
              Delete Account
            </span>
            <span className="text-blue-500" onClick={handleSignout}>
              Sign Out
            </span>
          </p>
        </Link>
      </form>

      <ToastContainer />
    </div>
  );
}
