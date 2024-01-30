import React from "react";

const CreateListing = () => {
  return (
    <main className="pt-8 p-3 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-center text-orange-500 font-extrabold text-xl sm:text-3xl pb-8">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row px-4 text-xs sm:text-sm gap-4">
        {/* left block */}
        <div className="flex flex-col gap-4  flex-1">
          <input
            type="text"
            id="title"
            placeholder="Title"
            className="border p-3 rounded-lg focus:outline-none"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg focus:outline-none"
            required
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg focus:outline-none"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex  gap-2">
              <input type="checkbox" id="sell" />
              <label htmlFor="sell">Sell</label>
            </div>
            <div className="flex  gap-2">
              <input type="checkbox" id="rent" />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex  gap-2">
              <input type="checkbox" id="parking" />
              <label htmlFor="parking">Parking</label>
            </div>
            <div className="flex  gap-2">
              <input type="checkbox" id="furnished" />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex  gap-2">
              {" "}
              <input type="checkbox" id="offer" />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bed"
                min="1"
                max="20"
                required
                className="border p-3 rounded-lg focus:outline-none"
              />
              <p>Bedrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bed"
                min="1"
                max="20"
                required
                className="border p-3 rounded-lg focus:outline-none"
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="20"
                required
                className="border p-3 rounded-lg focus:outline-none"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-[0.6rem]">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="1"
                max="20"
                required
                className="border p-3 rounded-lg focus:outline-none"
              />
              <div className="flex flex-col items-center">
                <p>Dscount Price</p>
                <span className="text-[0.6rem]">($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        {/* right block */}
        <div className="flex flex-col flex-1 gap-2">
          <p className="font-semibold">Images</p>
          <span className="text-xs italic">
            The first image will be the cover (max 6)
          </span>
          <div className="flex items-center border rounded-lg p-2 mb-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3  focus:outline-none w-full "
            />
            <button className="p-3 bg-purple-500 text-white uppercase rounded-lg hover:opacity-90 disabled:opacity-75">
              upload
            </button>
          </div>
          <button className="p-3 uppercase text-white  rounded-lg  bg-lime-500 w-full hover:opacity-90 disabled:op-70">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
