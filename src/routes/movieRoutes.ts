import express from 'express';
import movieController from '../controllers/movieController';

const router = express.Router()

router.route('/').get(movieController.getAllMovies).post(movieController.createMovie)
router.route('/:Id').get(movieController.getOneMovie).delete(movieController.deleteOneMovie).patch(movieController.updateMovie)

export = router