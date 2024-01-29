import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormdata] = useState({});
  const handleChange = (e) => {
    setFormdata({ ...formData, [e.target.id]: e.target.value });
  };
  console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

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
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
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
