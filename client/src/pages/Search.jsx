import React, { useEffect, useState } from "react";

export default function Search() {
  const [searchTerm, setsearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setsearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col sm:flex-row max-w-4xl mx-auto p-4 mt-6 gap-8 text-xs sm:text-sm">
      <div className="border-b sm:border-r sm:border-b-0">
        <form className="   flex flex-col gap-6 p-4 ">
          <div className="flex items-center gap-2">
            <p className="whitespace-nowrap font-semibold">Search Term:</p>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="bg-slate-100 rounded-lg p-3 text-slate-500 focus:outline-none "
              value={searchTerm}
              onChange={(e) => setsearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4 items-center flex-wrap">
            <p className="font-semibold">Type:</p>
            <div className="flex gap-2">
              <input type="checkbox" id="all" />
              <p>Rent & Sale</p>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="rent" />
              <p>Rent</p>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="sell" />
              <p>Sale</p>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="offer" />
              <p>Offer</p>
            </div>
          </div>
          <div className="flex gap-4">
            <p className="font-semibold">Amenities:</p>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" />
              <p>Parking</p>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" />
              <p>Furnished</p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <p className="font-semibold">Sort:</p>
            <select
              id="sort_order"
              className="rounded-lg border p-3 focus:outline-none"
            >
              <option>Price high to low</option>
              <option>Price low to high</option>
              <option>Latest</option>
              <option>Oldest</option>
            </select>
          </div>

          <button
            className="uppercase font-bold p-3 bg-red-600 hover:opacity-80 text-white w-full self-center transition duration-300 ease-in-out transform hover:scale-105 mt-4"
            onClick={handleSubmit}
          >
            Search
          </button>
        </form>
      </div>

      <div className="min-h-screen">
        <h1 className="text-center text-slate-500 font-extrabold text-xl sm:text-3xl my-2">
          Listing Results:
        </h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam
          soluta possimus doloribus blanditiis repellat quisquam fugit magni
          cupiditate, sapiente, maiores quos error rem reiciendis suscipit
          velit. Corporis nobis maxime sapiente rerum iusto quia quas aliquam
          blanditiis illum debitis soluta aut et eos modi dolores obcaecati
          consequuntur molestias quam, quidem ea voluptates eveniet! Eius
          repellendus ex similique debitis, architecto earum cum nobis provident
          laudantium omnis facere molestiae itaque, impedit natus cumque minima
          quam! Maiores esse deserunt recusandae culpa, neque consequatur
          corrupti deleniti inventore unde minus nihil dolor error. Dolorum
          voluptatum nihil perspiciatis amet, obcaecati eaque consequuntur
          vitae, illum iste aspernatur debitis!
        </p>
      </div>
    </div>
  );
}
