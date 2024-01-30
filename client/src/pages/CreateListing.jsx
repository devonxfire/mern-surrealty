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
//

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormdata] = useState({
    imageUrls: [],
  });

  console.log(formData);

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
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
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
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError(err.message);
          setUploading(false);
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

  return (
    <main className="pt-8 p-3 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-center text-orange-500 font-extrabold text-xl sm:text-3xl pb-8">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row px-4 text-xs sm:text-sm gap-4">
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
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg focus:outline-none"
            required
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg focus:outline-none"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex  gap-2">
              <input type="checkbox" id="sell" />
              <label htmlFor="sell">Sell</label>
            </div>
            <div className="flex  gap-2">
              <input type="checkbox" id="rent" />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex  gap-2">
              <input type="checkbox" id="parking" />
              <label htmlFor="parking">Parking</label>
            </div>
            <div className="flex  gap-2">
              <input type="checkbox" id="furnished" />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex  gap-2">
              {" "}
              <input type="checkbox" id="offer" />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bed"
                min="1"
                max="20"
                required
                className="border p-3 rounded-lg focus:outline-none"
              />
              <p>Bedrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bed"
                min="1"
                max="20"
                required
                className="border p-3 rounded-lg focus:outline-none"
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="20"
                required
                className="border p-3 rounded-lg focus:outline-none"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-[0.6rem]">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="1"
                max="20"
                required
                className="border p-3 rounded-lg focus:outline-none"
              />
              <div className="flex flex-col items-center">
                <p>Dscount Price</p>
                <span className="text-[0.6rem]">($ / month)</span>
              </div>
            </div>
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
              className="p-3 bg-purple-500 text-white uppercase rounded-lg hover:opacity-90 disabled:opacity-75"
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
                  className="w-20 h-20 object-contain  overflow-hidden"
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
          <button className="p-3 uppercase text-white  rounded-lg  bg-lime-500 w-full hover:opacity-90 disabled:op-70">
            Create Listing
          </button>
        </div>
      </form>
    </main>
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
