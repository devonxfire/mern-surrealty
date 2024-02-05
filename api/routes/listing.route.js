import express from "express";
import {
  createListing,
  deleteListing,
  editListing,
  getListing,
  searchListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:listingId", verifyToken, deleteListing);
router.put("/edit/:listingId", verifyToken, editListing);
router.get("/get/:listingId", getListing);
router.get("/get", searchListings);

export default router;
