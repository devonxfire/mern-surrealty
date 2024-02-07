import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import ListingCard from "../components/ListingCard";

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
    <div className="">
      {/* Top */}
      <div className="flex flex-col gap-6 sm:py-28 py-12 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-6xl text-slate-700 font-bold">
          Find your next
          <span className="text-slate-400 font-bold"> perfect</span> <br />
          place with ease
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm ">
          Surrealty Estate will help you find your dream home, with our luxury
          listings.
          <br />
          We have a wide range of properties to choose from.
        </p>
        <Link
          to="/search"
          className="text-blue-950 sm:text-xs font-bold hover:cursor-pointer"
        >
          Lets get started..
        </Link>
      </div>

      {/* Swiper */}

      <Swiper navigation={true} loop={true}>
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
        <h2 className="text-slate-700 font-bold text-xl sm:text-2xl text-center sm:text-left px-3">
          Recent Offers
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm text-center sm:text-left px-3 py-1">
          Show more offers
        </p>
        <div className="flex sm:flex-row flex-col px-6 sm:px-3 md:px-4 gap-4 ">
          {offerListings &&
            offerListings.map((listing) => (
              <ListingCard listing={listing} key={listing._id} />
            ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 ">
        <h2 className="text-slate-700 font-bold text-xl sm:text-2xl text-center sm:text-left px-3">
          Recent estates for rent
        </h2>
        <div className="flex sm:flex-row flex-wrap flex-col px-6 sm:px-3 md:px-4 gap-4 ">
          {rentListings &&
            rentListings.map((listing) => (
              <ListingCard listing={listing} key={listing._id} />
            ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 ">
        <h2 className="text-slate-700 font-bold text-xl sm:text-2xl text-center sm:text-left px-3">
          Recent estates for sale
        </h2>
        <div className="flex sm:flex-row flex-wrap flex-col px-6 sm:px-3 md:px-4 gap-4 ">
          {saleListings &&
            saleListings.map((listing) => (
              <ListingCard listing={listing} key={listing._id} />
            ))}
        </div>
      </div>
    </div>
  );
}
