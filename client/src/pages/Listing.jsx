import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  // if (currentUser) {
  //   const emailAddress = currentUser.email;
  // }

  // const subject = "I am interested in your property listing!";
  // const mailToLink = `mailto:${emailAddress}?subject=${encodeURIComponent(
  //   subject
  // )}`;

  console.log(listing.parking);

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
        <Swiper navigation={true}>
          {listing.imageUrls.map((url) => (
            <SwiperSlide key={url}>
              <div
                className="h-[50vh]"
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

      {/* {listing.imageUrls && (
        <img
          className="w-full h-[50vh] object-cover "
          src={listing.imageUrls[0]}
          alt="cover"
        />
      )} */}

      <div className="flex flex-col max-w-3xl mx-auto  p-6 text-sm sm:text-base gap-4">
        <h1 className="font-semibold text-lg sm:text-2xl">{listing.title}</h1>
        <p className="text-xs text-slate-500 font-semibold">
          {listing.address}
        </p>
        <div className="flex gap-2 text-xs sm:text-sm">
          <p className=" bg-orange-500 text-white px-12 py-1 rounded-lg  self-center">
            {listing.type === "sell" ? "For Sale" : "For Rent"}
          </p>
          <p className="bg-purple-500 text-white px-12 py-1 rounded-lg self-center">
            {listing.offer && listing.type === "rent"
              ? `Discounted Price $${listing.discountPrice.toLocaleString()} / month`
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
        <p className="sm:text-base text-sm">
          <span className="font-bold">Description: </span>
          {listing.description}
        </p>
        <div className="text-purple-500 text-xs flex gap-6">
          <div className="flex gap-1 items-center">
            <FaBed />
            <p>{listing.bedrooms} Beds</p>
          </div>

          <div className="flex gap-1 items-center">
            <FaBath />
            <p>{listing.bathrooms} Baths</p>
          </div>
          <div className="flex gap-1 items-center">
            <FaParking />
            <p>{listing.parking ? "Parking available" : "No parking"}</p>
          </div>
          <div className="flex gap-1 items-center">
            <FaChair />
            <p>{listing.furnished} Furnished</p>
          </div>
        </div>
        <a href="mailto:#">
          <button className="uppercase p-3 bg-slate-700 hover:opacity-80 text-white rounded-lg  w-full self-center transition duration-300 ease-in-out transform hover:scale-105 mt-4">
            contact agent
          </button>
        </a>
      </div>
    </main>
  );
}
