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
    const page = req.query.page
    const language = req.query.language
    const movies = await getMovies(page, language);
    res.status(200).json(movies);
}));

router.get('/tmdb/movie/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const movie = await getMovie(id);
    res.status(200).json(movie);
}));

// upcoming movies
router.get('/tmdb/upcoming', asyncHandler(async (req, res) => {
    const page = req.query.page
    const language = req.query.language
    const upcomingMovies = await getUpcomingMovies(language, page);
    res.status(200).json(upcomingMovies);
}));

// trending movies
router.get('/tmdb/trending', asyncHandler(async (req, res) => {
    const page = req.query.page
    const language = req.query.language
    const trendingMovies = await getTrendingMovies(language, page);
    res.status(200).json(trendingMovies);
}));

// movies genres
router.get('/tmdb/genres', asyncHandler(async (req, res) => {
    const language = req.query.language
    const moviesGenres = await getMoviesGenres(language);
    res.status(200).json(moviesGenres)
}));

// 获取演员电影作品
router.get('/tmdb/movie_credits/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const movieCredits = await getMovieCredits(id);
    res.status(200).json(movieCredits);
}));

router.get('/tmdb/movie/:id/image', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const movieImgs = await getMovieImages(id);
    res.status(200).json(movieImgs);
}));

router.get('/tmdb/movie/:id/review', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const movieReviews = await getMovieReviews(id);
    res.status(200).json(movieReviews);
}));



export default router;
