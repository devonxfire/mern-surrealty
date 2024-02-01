import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  signInStart,
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
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

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
  const [viewListings, setViewListings] = useState(false);
  const dispatch = useDispatch();

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
        console.log(res);
        const data = await res.json();
        console.log(data);
        setListings(data);
      };
      fetchMyListings();
    } catch (error) {
      console.log(error);
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

      if (data.success === false) {
        dispatch(updateFailure(data.message));
        setIsLoading(false);
        return;
      }
      dispatch(updateSuccess(data));
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      dispatch(updateFailure(error.message));
      setIsLoading(false);
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
    <div className="flex flex-col  pt-20 min-h-screen">
      <h1 className="text-center text-orange-500 font-extrabold text-xl sm:text-3xl">
        My Profile
      </h1>
      <form
        className="flex gap-4 flex-col  max-w-xl w-[85%] mx-auto px-4 py-8 shadow-xl rounded-lg text-sm sm:text-base"
        onSubmit={handleSubmit}
      >
        <img
          src={formData.photo || currentUser.photo}
          className="w-12 h-12 sm:w-24 sm:h-24 rounded-full self-center cursor-pointer"
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
            <span className="text-green-500">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>

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
        <button
          className="uppercase p-3 bg-purple-500 mt-4  hover:opacity-80 text-white rounded-lg w-[50%] sm:w-full self-center transition duration-300 ease-in-out transform hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Update profile"}
        </button>
        {isSuccess ? (
          <p className="text-green-500 text-sm">User updated successfully!</p>
        ) : null}

        <Link to="/create-listing" className="w-full flex justify-center">
          <button
            className="uppercase p-3 bg-lime-500 mt-[-6px] hover:opacity-80 text-white rounded-lg w-[50%] sm:w-full self-center transition duration-300 ease-in-out transform hover:scale-105"
            disabled={isLoading}
          >
            Create a new Listing
          </button>
        </Link>

        <Link
          to="/signin"
          className="text-xs sm:text-sm pt-4 text-center sm:text-left"
        >
          <p className="flex justify-between">
            <span className="text-red-500" onClick={handleDelete}>
              Delete Account
            </span>
            <span className="text-blue-500" onClick={handleSignout}>
              Sign Out
            </span>
          </p>
        </Link>

        <button
          onClick={() => setViewListings(!viewListings)}
          className="w-full"
        >
          {viewListings ? "Hide my listings" : "View my listings"}
        </button>

        {/* View my listings UI*/}
        {viewListings &&
          listings.length > 0 &&
          listings.map((listing) => (
            <div
              key={listing._id}
              className="border mt-4 rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700   hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.title}</p>
              </Link>

              <div className="flex items-center gap-1">
                <button className="text-purple-500">Edit</button>
                <FaEdit className="text-lg cursor-pointer text-purple-500 mr-4" />
                <button className="text-red-500">Delete</button>
                <MdDelete className="text-lg cursor-pointer  text-red-500" />
              </div>
            </div>
          ))}

        <p className="text-red-500">
          {error ? error : ""}
          {error && (
            <button
              className="border bg-purple-500 text-white px-3  ml-2 rounded-lg"
              onClick={() => dispatch(signInStart())}
            >
              OK
            </button>
          )}
        </p>
      </form>
    </div>
  );
}
