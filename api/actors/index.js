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
    try {
        let { page = 1, limit = 10 } = req.query;
        [page, limit] = [+page, +limit];

        if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
            throw new Error('Invalid page or limit');
        }

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
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));


// 获取单个演员的详细信息
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) {
            throw new Error('Invalid ID');
        }

        const actor = await actorModel.findByActorDBId(id);
        if (!actor) {
            res.status(404).json({message: 'The actor you requested could not be found.', status_code: 404});
        } else {
            res.status(200).json(actor);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));


// 获取流行演员
router.get('/tmdb/actors', asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const language = req.query.language;

        if (isNaN(page) || page <= 0 || !language) {
            throw new Error('Invalid page or language');
        }

        const popularActors = await getPopularActors(language, page);
        res.status(200).json(popularActors);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));


// 获取单个演员
router.get('/tmdb/actor/:id', asyncHandler(async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) {
            throw new Error('Invalid ID');
        }

        const actor = await getActor(id);
        if (!actor) {
            res.status(404).json({ message: 'The actor you requested could not be found.', status_code: 404 });
        } else {
            res.status(200).json(actor);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));


// 获取演员图片
router.get('/tmdb/images/:id', asyncHandler(async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) {
            throw new Error('Invalid ID');
        }

        const actorImages = await getActorImages(id);
        if (!actorImages) {
            res.status(404).json({ message: 'No images found for the provided actor ID.', status_code: 404 });
        } else {
            res.status(200).json(actorImages);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));


// 获取演员电影作品
router.get('/tmdb/movie_credits/:id', asyncHandler(async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const language = req.query.language || 'en-US'; // Default language if not provided

        if (isNaN(id) || id <= 0) {
            throw new Error('Invalid ID');
        }

        const actorMovieCredits = await getActorMovieCredits(id, language);
        if (!actorMovieCredits) {
            res.status(404).json({ message: 'No movie credits found for the provided actor ID.', status_code: 404 });
        } else {
            res.status(200).json(actorMovieCredits);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));


export default router;
