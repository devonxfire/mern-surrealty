import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function MyListings() {
  const { currentUser } = useSelector((state) => state.user);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const res = await fetch(`api/users/listings/${currentUser._id}`);
      const data = await res.json();
      console.log(data);
      setListings(data);
    };
    fetchListings();
    console.log(listings);
  }, []);

  return (
    <div>
      {listings.map((listing) => (
        <div key={listing._id}>
          <p>{listing.title}</p>
          <p>{listing.description}</p>
          <img
            src={listing.imageUrls[0]}
            alt="pictures"
            className="w-40 rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}

export default MyListings;
