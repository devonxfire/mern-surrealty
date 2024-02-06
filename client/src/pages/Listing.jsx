import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  // if (currentUser) {
  //   const emailAddress = currentUser.email;
  // }

  // const subject = "I am interested in your property listing!";
  // const mailToLink = `mailto:${emailAddress}?subject=${encodeURIComponent(
  //   subject
  // )}`;

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        console.log(data.message);
        setLoading(false);
        return;
      }
      setListing(data);
      setLoading(false);
    };

    fetchListing();
  }, []);
  return (
    <main>
      {loading && (
        <p className="text-center text-lg text-slate-800 italic">Loading...</p>
      )}

      {listing && listing.imageUrls && (
        <Swiper navigation={true} loop={true}>
          {listing.imageUrls.map((url) => (
            <SwiperSlide key={url}>
              <div
                className="h-[50vh] "
                style={{
                  background: `url(${url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="flex flex-col max-w-3xl mx-auto  p-6 text-sm sm:text-base gap-4">
        <h1 className="font-semibold text-lg text-slate-500 sm:text-2xl">
          {listing.title}
        </h1>
        <div className="flex gap-1 items-center text-green-700">
          <FaLocationDot className="text-xs" />
          <p className="text-xs font-semibold">{listing.address}</p>
        </div>

        <div className="flex gap-2 text-xs sm:text-sm">
          <p className=" bg-blue-950 text-white px-12 py-1   self-center">
            {listing.type === "sell" ? "For Sale" : "For Rent"}
          </p>
          <p className="bg-slate-500 text-white px-12 py-1  self-center">
            {listing.offer && listing.type === "rent"
              ? `Discount Price $${listing.discountPrice.toLocaleString()} / month`
              : "" ||
                (listing.offer &&
                  listing.type === "sell" &&
                  `Discounted Price $${listing.discountPrice.toLocaleString()}`) ||
                (listing.type === "sell" &&
                  !listing.offer &&
                  `Price $${listing.regularPrice.toLocaleString()}`) ||
                (listing.type === "rent" &&
                  !listing.offer &&
                  `Price $${listing.regularPrice.toLocaleString()} / month`)}
          </p>
        </div>
        <p className="sm:text-sm text-xs text-slate-500">
          <span className="font-bold">Description: </span>
          {listing.description}
        </p>
        <div className="text-green-700 text-xs flex gap-6 flex-wrap">
          <div className="flex gap-1 items-center">
            <FaBed />
            <p>
              {listing.bedrooms && listing.bedrooms < 2
                ? `${listing.bedrooms} Bed`
                : `${listing.bedrooms} Beds`}
            </p>
          </div>

          <div className="flex gap-1 items-center">
            <FaBath />
            <p>
              {listing.bathrooms && listing.bathrooms < 2
                ? `${listing.bathrooms} Bath`
                : `${listing.bathrooms} Baths`}
            </p>
          </div>
          <div className="flex gap-1 items-center">
            <FaParking />
            <p>{listing.parking ? "Parking available" : "No parking"}</p>
          </div>
          <div className="flex gap-1 items-center">
            <FaChair />
            <p>{listing.furnished ? "Furnished" : "Not furnished"}</p>
          </div>
        </div>
        {!currentUser && !contact && currentUser?._id !== listing.userRef && (
          <button
            className="uppercase font-bold p-3 bg-red-600 hover:opacity-80 text-white w-full self-center transition duration-300 ease-in-out transform hover:scale-105 mt-4"
            onClick={() => setContact(true)}
          >
            contact the agent
          </button>
        )}

        {contact && <Contact listing={listing} />}

        {currentUser && currentUser._id === listing.userRef && (
          <Link to={`/edit-listing/${listing._id}`}>
            <button className="uppercase font-bold p-3 bg-red-600 hover:opacity-80 text-white w-full self-center transition duration-300 ease-in-out transform hover:scale-105 mt-4">
              edit my listing
            </button>
          </Link>
        )}
      </div>
    </main>
  );
}
