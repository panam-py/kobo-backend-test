import express from 'express';
import characterController from '../controllers/characterController';

const router = express.Router()

router.route('/').get(characterController.getAllCharacters).post(characterController.createCharacter)
router.route('/:Id').get(characterController.getOneCharacter).delete(characterController.deleteCharacter).patch(characterController.updateCharacter)
router.patch('/addtomovie/:Id', characterController.addToMovie)
router.patch('/removefrommovie/:Id', characterController.removeFromMovie)

export = router