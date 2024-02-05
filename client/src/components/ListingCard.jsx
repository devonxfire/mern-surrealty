import React from "react";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";

function ListingCard({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-xl transition-shadow overflow-hidden w-full sm:w-[330px] rounded-lg">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="cover-image"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2">
          <p className="text-lg text-blue-950 font-semibold truncate">
            {listing.title}
          </p>
          <div className="flex gap-2 text-xs">
            <FaLocationDot className="text-green-700" />
            <p>{listing.address}</p>
          </div>
          <p className="text-slate-500 text-xs">{listing.description}</p>
        </div>
      </Link>
    </div>
  );
}

export default ListingCard;
