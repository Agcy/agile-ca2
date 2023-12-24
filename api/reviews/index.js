import Review from './reviewModel'
import express from 'express';
import asyncHandler from "express-async-handler";
import {authenticate} from "../../authenticate";
import jwt from 'jsonwebtoken';

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


router.post('/tmdb/:movieId', asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const { userId, author, review, rating } = req.body;

    const reviewData = await Review.create({ movieId, userId, author, review, rating }).catch(err => null);

    if (reviewData) {
        res.status(201).json(reviewData);
    } else {
        res.status(500).json({ message: 'Internal server error' });
    }
}));

router.delete('/tmdb/:reviewId', async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId).catch(err => null);

    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    // if (review.userId.toString() !== req.user.id) { // 假设 req.user.id 是当前登录用户的 ID
    //     return res.status(403).json({ message: 'Unauthorized to delete this review' });
    // }

    const result = await review.deleteOne({ _id: reviewId }).catch(err => null);

    if (result) {
        res.status(200).json({ message: 'Review deleted successfully' });
    } else {
        res.status(500).json({ message: 'Internal server error' });
    }
});



export default router;

