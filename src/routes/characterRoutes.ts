import express from 'express';
import characterController from '../controllers/characterController';
import commonController from '../controllers/commonController';

const router = express.Router()

router.route('/').get(characterController.getAllCharacters).post(characterController.createCharacter)
// router.use(commonController.checkIDTypeMiddleware);
router.route('/:Id').get(commonController.checkIDTypeMiddleware, characterController.getOneCharacter).delete(commonController.checkIDTypeMiddleware, characterController.deleteCharacter).patch(commonController.checkIDTypeMiddleware, characterController.updateCharacter)
router.patch('/addtomovie/:Id', commonController.checkIDTypeMiddleware, characterController.addToMovie)
router.patch('/removefrommovie/:Id', commonController.checkIDTypeMiddleware, characterController.removeFromMovie)

export = router