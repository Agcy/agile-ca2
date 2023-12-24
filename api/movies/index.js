import movieModel from './movieModel';
import {
    getUpcomingMovies,
    getMoviesGenres,
    getTrendingMovies,
    getMovies,
    getMovieCredits,
    getMovieImages,
    getMovie, getMovieReviews
} from '../tmdb-api';
import asyncHandler from 'express-async-handler';
import express from 'express';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    let { page = 1, limit = 10 } = req.query; // destructure page and limit and set default values
    [page, limit] = [+page, +limit]; //trick to convert to numeric (req.query will contain string values)

    // Parallel execution of counting movies and getting movies using movieModel
    const [total_results, results] = await Promise.all([
        movieModel.estimatedDocumentCount(),
        movieModel.find().limit(limit).skip((page - 1) * limit)
    ]);
    const total_pages = Math.ceil(total_results / limit); //Calculate total number of pages (= total No Docs/Number of docs per page)

    //construct return Object and insert into response object
    const returnObject = {
        page,
        total_pages,
        total_results,
        results
    };
    res.status(200).json(returnObject);
}));

// Get movie details
router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const movie = await movieModel.findByMovieDBId(id);
    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).json({message: 'The movie you requested could not be found.', status_code: 404});
    }
}));

// discover movies
router.get('/tmdb/home', asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const language = req.query.language;

        if (isNaN(page) || page <= 0 || !language) {
            throw new Error('Invalid parameters');
        }

        const movies = await getMovies(page, language);
        res.status(200).json(movies);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));

router.get('/tmdb/movie/:id', asyncHandler(async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) {
            throw new Error('Invalid ID');
        }

        const movie = await getMovie(id);
        if (!movie) {
            res.status(404).json({ message: "The resource you requested could not be found." });
        } else {
            res.status(200).json(movie);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));


// upcoming movies
router.get('/tmdb/upcoming', asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const language = req.query.language;

        if (isNaN(page) || page <= 0 || !language) {
            throw new Error('Invalid parameters');
        }

        const upcomingMovies = await getUpcomingMovies(language, page);
        res.status(200).json(upcomingMovies);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));


// trending movies
router.get('/tmdb/trending', asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const language = req.query.language;

        if (isNaN(page) || page <= 0 || !language) {
            throw new Error('Invalid parameters');
        }

        const trendingMovies = await getTrendingMovies(language, page);
        res.status(200).json(trendingMovies);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));

// movies genres
router.get('/tmdb/genres', asyncHandler(async (req, res) => {
    try {
        const language = req.query.language || 'en-US'; // Default to 'en-US' if language is not provided

        const moviesGenres = await getMoviesGenres(language);
        res.status(200).json(moviesGenres);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));


// 获取演员电影作品
router.get('/tmdb/movie_credits/:id', asyncHandler(async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) {
            throw new Error('Invalid ID');
        }

        const movieCredits = await getMovieCredits(id);
        if (!movieCredits) {
            res.status(404).json({ message: "No movie credits found for the provided ID." });
        } else {
            res.status(200).json(movieCredits);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));


router.get('/tmdb/movie/:id/image', asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(Number(id))) {
            throw new Error('Invalid ID');
        }

        const movieImgs = await getMovieImages(id);
        if (!movieImgs) {
            res.status(404).json({ message: "No images found for the provided movie ID." });
        } else {
            res.status(200).json(movieImgs);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));


router.get('/tmdb/movie/:id/review', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const movieReviews = await getMovieReviews(id);
    res.status(200).json(movieReviews);
}));



export default router;
