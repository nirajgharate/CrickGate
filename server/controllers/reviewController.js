import Review from "../models/review.js";
import Turf from "../models/turf.js";

// Add a review and recalculate Turf average rating
export const AddReview = async (req, res) => {
    const userId = req.userId;
    const { turfId, rating, comment } = req.body;

    if (!turfId || !rating) {
        return res.status(400).json({ success: false, message: "Turf ID and Rating are required" });
    }

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Save the review
    const newReview = new Review({
        turfId,
        userId,
        rating: numericRating,
        comment: comment || ""
    });

    await newReview.save();

    // Recalculate average rating for the turf
    const reviews = await Review.find({ turfId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    // Update turf average rating (round to 1 decimal place)
    await Turf.findByIdAndUpdate(turfId, {
        rating: Math.round(averageRating * 10) / 10
    });

    res.status(201).json({
        success: true,
        message: "Review submitted successfully!",
        review: newReview,
        averageRating: Math.round(averageRating * 10) / 10
    });
};

// Get all reviews for a turf field
export const GetTurfReviews = async (req, res) => {
    const { turfId } = req.params;

    const reviews = await Review.find({ turfId })
        .populate('userId', 'name')
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
};
