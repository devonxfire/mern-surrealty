import { useState } from "react";
import { MdDelete } from "react-icons/md";
// Firebase Image Imports
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormdata] = useState({
    imageUrls: [],
    title: "",
    description: "",
    address: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
  });

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
          showToastOnError(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
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

  const handleImageUpload = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormdata({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setError(false);
          setLoading(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError(err.message);
          setUploading(false);
          showToastOnError(error.message);
        });
    } else {
      setImageUploadError("Please select between 1 and 6 images");
      setUploading(false);
    }
  };

  const handleDeleteImage = (index) => {
    setFormdata({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormdata({ ...formData, type: e.target.id });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormdata({ ...formData, [e.target.id]: e.target.checked });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormdata({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      if (formData.title.length < 3) {
        setLoading(false);
        return showToastOnError("Title must be at least 3 characters long");
      }

      if (formData.imageUrls.length < 1) {
        setLoading(false);
        return showToastOnError("Please upload at least one image");
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        setLoading(false);
        return showToastOnError(
          "Discount price cannot be higher than regular price"
        );
      }

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        return showToastOnError("An error occurred");
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      showToastOnError(error);

      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-white to-slate-300">
      <main className="pt-8 p-3 max-w-4xl mx-auto min-h-screen ">
        <h1 className="text-center  font-bold text-xl sm:text-3xl">
          Create a new Listing
        </h1>
        <form className="flex flex-col sm:flex-row px-4 text-xs sm:text-sm gap-4 py-8 text-slate-500">
          {/* left block */}
          <div className="flex flex-col gap-4  flex-1">
            <input
              type="text"
              id="title"
              placeholder="Title"
              className="border p-3 rounded-lg focus:outline-none"
              maxLength="62"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.title}
            />
            <textarea
              type="text"
              id="description"
              placeholder="Description"
              className="border p-3 rounded-lg focus:outline-none"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              id="address"
              placeholder="Address"
              className="border p-3 rounded-lg focus:outline-none"
              required
              onChange={handleChange}
              value={formData.address}
            />
            <div className="flex gap-6 flex-wrap">
              <div className="flex  gap-2">
                <input
                  type="checkbox"
                  id="sell"
                  onChange={handleChange}
                  checked={formData.type === "sell"}
                />
                <label htmlFor="sell">Sell</label>
              </div>
              <div className="flex  gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <label htmlFor="rent">Rent</label>
              </div>
              <div className="flex  gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <label htmlFor="parking">Parking</label>
              </div>
              <div className="flex  gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <label htmlFor="furnished">Furnished</label>
              </div>
              <div className="flex  gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <label htmlFor="offer">Offer</label>
              </div>
            </div>
            <div className="flex gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="20"
                  required
                  className="border p-3 rounded-lg focus:outline-none"
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <p>{formData.bedrooms > 1 ? "Bedrooms" : "Bedroom"}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="20"
                  required
                  className="border p-3 rounded-lg focus:outline-none"
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <p>{formData.bathrooms > 1 ? "Bathrooms" : "Bathroom"}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  min="50"
                  max="200000"
                  required
                  className="border p-3 rounded-lg focus:outline-none"
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Regular Price</p>
                  <span className="text-[0.6rem]">
                    {formData.type === "rent" ? "($ / month)" : ""}
                  </span>
                </div>
              </div>
              {formData.offer && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="200000"
                    required
                    className="border p-3 rounded-lg focus:outline-none"
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  <div className="flex flex-col items-center">
                    <p>Discount Price</p>
                    <span className="text-[0.6rem]">
                      {formData.type === "rent" ? "($ / month)" : ""}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* right block */}
          <div className="flex flex-col flex-1 gap-2">
            <p className="font-semibold">Images</p>
            <span className="text-xs italic">
              The first image will be the cover (max 6)
            </span>
            <div className="flex items-center border rounded-lg p-2 mb-4">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                className="p-3  focus:outline-none w-full "
                onChange={(e) => setFiles(e.target.files)}
              />
              <button
                className="uppercase font-bold p-2 bg-blue-950 hover:opacity-80 text-white w-[60%] self-center transition duration-300 ease-in-out transform hover:scale-105 text-xs disabled:opacity-70"
                type="button"
                disabled={uploading}
                onClick={handleImageUpload}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <p className="text-red-500 text-xs">
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  className="flex justify-between p-3 border rounded-lg items-center"
                  key={url}
                >
                  <img
                    src={url}
                    alt="listing"
                    className="w-20 h-20 object-contain "
                  />
                  <div
                    className="flex items-center text-red-500 gap-1"
                    onClick={() => handleDeleteImage(index)}
                  >
                    <button className=" text-red-500 uppercase hover:opacity-90">
                      delete
                    </button>
                    <MdDelete className="text-lg cursor-pointer" />
                  </div>
                </div>
              ))}
            <button
              className="uppercase font-bold p-3 bg-red-700 hover:opacity-80 text-white w-full self-center transition duration-300 ease-in-out transform hover:scale-105 mt-4 text-sm"
              disabled={loading || uploading}
              onClick={handleCreateListing}
            >
              {loading ? "Creating..." : "+ Create Listing"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <ToastContainer />
        </form>
      </main>
    </div>
  );
};

export default CreateListing;

// service firebase.storage {
//     match /b/{bucket}/o {
//       match /{allPaths=**} {
//         allow read;
//         allow write: if
//         request.resource.size < 10 * 1024 * 1024 &&
//         request.resource.contentType.matches('image/.*')
//       }
//     }
//   }
