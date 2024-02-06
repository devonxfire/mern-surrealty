import React from "react";
import { Link } from "react-router-dom";
import { FaBath, FaBed, FaLocationDot } from "react-icons/fa6";

function ListingCard({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-xl transition-shadow overflow-hidden sm:max-w-[16rem] w-full rounded-lg mt-8 ">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="cover-image"
          className=" w-full h-48 object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg text-blue-950 font-semibold truncate">
            {listing.title}
          </p>
          <div className="flex gap-2 text-xs">
            <FaLocationDot className="text-green-700" />
            <p>{listing.address}</p>
          </div>
          <p className="text-slate-500 text-xs line-clamp-2">
            {listing.description}
          </p>
          <p className="text-blue-950 font-semibold">
            {listing.offer
              ? `$${listing.discountPrice.toLocaleString()}`
              : `$${listing.regularPrice.toLocaleString()}`}
            {listing.type === "rent" && " / month"}
          </p>

          <div className="flex gap-4 items-center text-xs text-green-700">
            <div className="flex gap-1 items-center">
              <FaBed />
              {listing.bedrooms && listing.bedrooms < 2
                ? `${listing.bedrooms} Bed`
                : `${listing.bedrooms} Beds`}
            </div>

            <div className="flex gap-1 items-center">
              <FaBath />
              {listing.bathrooms && listing.bathrooms < 2
                ? `${listing.bathrooms} Bath`
                : `${listing.bathrooms} Baths`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ListingCard;
