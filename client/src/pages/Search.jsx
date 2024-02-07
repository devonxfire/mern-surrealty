import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";

export default function Search() {
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      offerFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        offer: offerFromUrl === "true" ? true : false,
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      try {
        setShowMore(false);
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        console.log(res);
        const data = await res.json();

        if (data.length > 8) {
          setShowMore(true);
        }

        if (data.length < 9) {
          setShowMore(false);
        }

        setListings(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListings();
  }, [location.search]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sell"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("offer", sidebardata.offer.toString());
    urlParams.set("parking", sidebardata.parking.toString());
    urlParams.set("furnished", sidebardata.furnished.toString());
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const showMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="flex flex-col sm:flex-row  mx-auto p-4 mt-6 gap-8 text-xs sm:text-sm max-w-7xl">
      <div className="border-b sm:border-r sm:border-b-0">
        <form className="flex flex-col gap-6 p-4 " onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <p className="whitespace-nowrap font-semibold">Search Term:</p>
            <input
              type="text"
              id="searchTerm"
              onChange={handleChange}
              value={sidebardata.searchTerm}
              placeholder="Search..."
              className="bg-slate-100 rounded-lg p-3 text-slate-500 focus:outline-none "
            />
          </div>

          <div className="flex gap-4 items-center flex-wrap">
            <p className="font-semibold">Type:</p>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <p>Rent & Sale</p>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <p>Rent</p>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sell"
                onChange={handleChange}
                checked={sidebardata.type === "sell"}
              />
              <p>Sale</p>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <p>Offer</p>
            </div>
          </div>
          <div className="flex gap-4">
            <p className="font-semibold">Amenities:</p>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <p>Parking</p>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <p>Furnished</p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <p className="font-semibold">Sort:</p>
            <select
              id="sort_order"
              className="rounded-lg border p-3 focus:outline-none"
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
            >
              <option value={"regularPrice_desc"}>Price high to low</option>
              <option value={"regularPrice_asc"}>Price low to high</option>
              <option value={"createdAt_desc"}>Latest</option>
              <option value={"createdAt_asc"}>Oldest</option>
            </select>
          </div>

          <button className="uppercase font-bold p-3 bg-red-600 hover:opacity-80 text-white w-full self-center transition duration-300 ease-in-out transform hover:scale-105 mt-4">
            Search
          </button>
        </form>
      </div>
      {/* Right block for result cards */}
      <div className="min-h-screen w-full">
        <h1 className="text-center  text-slate-500 font-bold text-xl sm:text-3xl my-2">
          {listings.length}{" "}
          <span className="font-light"> listings matched your search</span>
        </h1>
        <div className="flex ">
          <div className="flex flex-wrap gap-4">
            {!loading && listings.length === 0 && <p>No listing found!</p>}

            {loading && <p>Loading...</p>}

            {!loading &&
              listings &&
              listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            {console.log(showMore)}
            {showMore && (
              <button
                className="text-green-700 p-7 hover:underline"
                onClick={showMoreClick}
              >
                Show more...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
