import actorModel from './actorModel';
import {
    getPopularActors,
    getActorImages,
    getActor,
    getActorMovieCredits
} from '../tmdb-api';
import asyncHandler from 'express-async-handler';
import express from 'express';

const router = express.Router();

// 获取演员列表
router.get('/', asyncHandler(async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    [page, limit] = [+page, +limit];

    const [total_results, results] = await Promise.all([
        actorModel.estimatedDocumentCount(),
        actorModel.find().limit(limit).skip((page - 1) * limit)
    ]);
    const total_pages = Math.ceil(total_results / limit);

    const returnObject = {
        page,
        total_pages,
        total_results,
        results
    };
    res.status(200).json(returnObject);
}));

// 获取单个演员的详细信息
router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const actor = await actorModel.findByActorDBId(id);
    if (actor) {
        res.status(200).json(actor);
    } else {
        res.status(404).json({message: 'The actor you requested could not be found.', status_code: 404});
    }
}));

// 获取流行演员
router.get('/tmdb/actors', asyncHandler(async (req, res) => {
    const page = req.query.page
    const language = req.query.language
    const popularActors = await getPopularActors(language, page);
    res.status(200).json(popularActors);
}));

// 获取单个演员
router.get('/tmdb/actor/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)
    const popularActors = await getActor(id);
    res.status(200).json(popularActors);
}));

// 获取演员图片
router.get('/tmdb/images/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const actorImages = await getActorImages(id);
    res.status(200).json(actorImages);
}));

// 获取演员电影作品
router.get('/tmdb/movie_credits/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const language = req.query.language
    const actorMovieCredits = await getActorMovieCredits(id, language);
    res.status(200).json(actorMovieCredits);
}));

export default router;
