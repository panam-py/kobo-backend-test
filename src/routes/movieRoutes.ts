import express from 'express';
import movieController from '../controllers/movieController';
import commonController from '../controllers/commonController';

const router = express.Router()

router.route('/').get(movieController.getAllMovies).post(movieController.createMovie)
router.route('/:Id').get(commonController.checkIDTypeMiddleware, movieController.getOneMovie).delete(commonController.checkIDTypeMiddleware, movieController.deleteOneMovie).patch(commonController.checkIDTypeMiddleware, movieController.updateMovie)

export = router