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
