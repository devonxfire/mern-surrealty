import { Listing } from "../models/listing.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createListing = async (req, res, next) => {
  try {
    const listingExists = await Listing.findOne({ title: req.body.title });

    if (listingExists) {
      return next(errorHandler(400, "Listing already exists"));
    }

    const listing = await Listing.create(req.body);

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.listingId);

    if (!listing) return next(errorHandler(404, "Listing not found"));

    if (req.user.id !== listing.userRef)
      return next(
        errorHandler(403, "You are not authorized to delete this listing")
      );

    await Listing.findByIdAndDelete(req.params.listingId);

    res.status(200).json("Listing deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const editListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.listingId);

  if (!listing) return next(errorHandler(404, "Listing not found"));

  if (req.user.id !== listing.userRef)
    return next(
      errorHandler(403, "You are not authorized to edit this listing")
    );
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.listingId,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.listingId);

    if (!listing) return next(errorHandler(404, "Listing not found"));

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const searchListings = async (req, res, next) => {
  try {
    const parseBoolean = (value) => {
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      return Boolean(value);
    };

    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = parseBoolean(req.query.offer);

    if (offer === false || offer === undefined) {
      offer = { $in: [true, false] };
    }

    let furnished = parseBoolean(req.query.furnished);

    if (furnished === false || furnished === undefined) {
      furnished = { $in: [true, false] };
    }

    let parking = parseBoolean(req.query.parking);

    if (parking === false || parking === undefined) {
      parking = { $in: [true, false] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sell", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    console.log("MongoDB Query:", {
      title: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    });

    const listings = await Listing.find({
      title: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
