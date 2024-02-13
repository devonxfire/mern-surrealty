import { MdDelete } from "react-icons/md";
import { FaEdit, FaRegEye } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function () {
  // View my listings functionality

  const [listings, setListings] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
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

  const handleDelete = async (listingId) => {
    try {
      const res = await fetch(`api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      const newListings = listings.filter(
        (listing) => listing._id !== listingId
      );
      setListings(newListings);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-slate-300">
      <div className="flex flex-col  pt-16 ">
        <div className="container max-w-xl rounded-lg shadow-lg p-3 mx-auto pb-8 bg-white">
          <h1 className="text-center text-slate-600 font-bold text-xl sm:text-3xl pt-4">
            My Listings
          </h1>
          {listings.length === 0 && (
            <p className="text-sm text-slate-500 pt-8">
              You do not have any listings. Please click the button below to
              create a new listing.
            </p>
          )}
          {listings.length > 0 &&
            listings.map((listing) => (
              <div
                key={listing._id}
                className="border mt-4 rounded-lg p-3 flex justify-between items-center gap-4 hover:bg-slate-100 text-slate-500  "
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-contain"
                  />
                </Link>
                <Link
                  className="   truncate flex-1"
                  to={`/listing/${listing._id}`}
                >
                  <p className="text-sm">{listing.title}</p>
                </Link>

                <div className="flex items-center gap-1 ">
                  <Link
                    className="  flex items-center gap-2"
                    to={`/listing/${listing._id}`}
                  >
                    <button className="text-green-700 text-sm">View</button>
                    <FaRegEye className="text-sm cursor-pointer text-green-700  mr-4" />{" "}
                  </Link>
                </div>

                <div className="flex items-center gap-1 ">
                  <Link
                    to={`/edit-listing/${listing._id}`}
                    className="flex items-center gap-2"
                  >
                    <button className="text-slate-500 text-sm">Edit</button>
                    <FaEdit className="text-sm cursor-pointer text-slate-500  mr-4" />
                  </Link>

                  <button
                    className="text-red-700 text-sm"
                    onClick={() => handleDelete(listing._id)}
                  >
                    Delete
                  </button>
                  <MdDelete
                    className="text-lg cursor-pointer  text-red-700"
                    onClick={() => handleDelete(listing._id)}
                  />
                </div>
              </div>
            ))}
          <div className="flex justify-center mt-6">
            <Link to="/create-listing" className="">
              <button className="uppercase font-bold p-3 bg-red-700 hover:opacity-80 text-white w-full  transition duration-300 ease-in-out transform hover:scale-105 text-xs whitespace-nowrap mt-4">
                + Create a new Listing
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
