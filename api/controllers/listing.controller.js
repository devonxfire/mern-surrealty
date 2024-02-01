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
