import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import ListingCard from "../components/ListingCard";
import couple from "../assets/couple.jpg";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get/?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get/?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get/?type=sell&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className="bg-slate-100">
      <div
        className="relative"
        style={{
          position: "relative",
          backgroundImage: `url(${couple})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="bg-black opacity-80 absolute inset-0"></div>

        <div className="flex items-center max-w-6xl mx-auto relative">
          <div className="flex flex-col gap-6 sm:py-28 py-12 mx-auto md:mx-0 pl-8">
            <div className="flex flex-wrap items-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                Find your next
                <span className="text-red-600 font-bold"> perfect</span> <br />
                home with ease.
              </h1>
            </div>
            <p className="text-white text-xs sm:text-sm border-b pb-6">
              Surrealty Estate will help you find your dream home with our
              luxury listings, or sell <br />
              your beloved home to the right buyer.
            </p>
            <Link
              to="/search"
              className="text-blue-950 sm:text-xs font-bold hover:cursor-pointer mt-2"
            >
              <button className="uppercase font-bold p-3 bg-red-600 hover:opacity-80 text-white sm:w-[40%] text-xs sm:text-sm w-full self-center transition duration-300 ease-in-out transform hover:scale-105">
                browse listings
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Swiper */}

      <Swiper navigation={true} loop={true} className="mt-8">
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[400px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listing results */}
      <div className="max-w-6xl mx-auto mt-8 ">
        <Link to={"/search?offer=true"}>
          <h2 className="text-slate-700 font-bold text-xl sm:text-2xl text-center sm:text-left px-3">
            Recent offers
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm text-center sm:text-left px-3 py-1">
            Show more offers
          </p>
        </Link>

        <div className="flex sm:flex-row flex-col px-6 sm:px-3 md:px-4 gap-4 ">
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <ListingCard listing={listing} key={listing._id} />
            ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 ">
        <Link to={"/search?type=rent"}>
          <h2 className="text-slate-700 font-bold text-xl sm:text-2xl text-center sm:text-left px-3">
            Recent estates for rent
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm text-center sm:text-left px-3 py-1">
            Show more places to rent
          </p>
        </Link>
        <div className="flex sm:flex-row flex-wrap flex-col px-6 sm:px-3 md:px-4 gap-4 ">
          {rentListings &&
            rentListings.length > 0 &&
            rentListings.map((listing) => (
              <ListingCard listing={listing} key={listing._id} />
            ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 ">
        <Link to={"/search?type=sell"}>
          <h2 className="text-slate-700 font-bold text-xl sm:text-2xl text-center sm:text-left px-3">
            Recent estates for sale
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm text-center sm:text-left px-3 py-1">
            Show more places for sale
          </p>
        </Link>
        <div className="flex sm:flex-row flex-wrap flex-col px-6 sm:px-3 md:px-4 gap-4 ">
          {saleListings &&
            saleListings.length > 0 &&
            saleListings.map((listing) => (
              <ListingCard listing={listing} key={listing._id} />
            ))}
        </div>
      </div>
    </div>
  );
}
