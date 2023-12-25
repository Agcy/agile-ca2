import Review from './reviewModel'
import express from 'express';
import asyncHandler from "express-async-handler";
import {authenticate} from "../../authenticate";

const router = express.Router(); // eslint-disable-line

router.get('/tmdb/user/:userId', authenticate, asyncHandler(async (req, res) => {
    try{
        const { userId } = req.params;
        const reviews = await Review.find({userId});

        if (!reviews) {
            return res.status(404).json({ message: `No reviews found for user ${userId}` });
        }

        res.status(200).json(reviews);
    } catch (error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}));


router.get('/tmdb/all', async (req, res) => {
    try {
        const reviews = await Review.find();
        if (reviews && reviews.length > 0) {
            res.status(200).json(reviews);
        } else {
            res.status(404).json({ message: 'No reviews found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


router.post('/tmdb/:movieId', authenticate, asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const { userId, author, review, rating } = req.body;

    try {
        const reviewData = await Review.create({ movieId, userId, author, review, rating });
        res.status(201).json(reviewData);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}));


router.delete('/tmdb/:reviewId', authenticate, asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // if (review.userId.toString() !== req.user.id) {
        //     return res.status(403).json({ message: 'Unauthorized to delete this review' });
        // }

        await review.deleteOne();
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}));

export default router;

