"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const characterController_1 = __importDefault(require("../controllers/characterController"));
const router = express_1.default.Router();
router.route('/').get(characterController_1.default.getAllCharacters).post(characterController_1.default.createCharacter);
router.route('/:Id').get(characterController_1.default.getOneCharacter).delete(characterController_1.default.deleteCharacter).patch(characterController_1.default.updateCharacter);
router.patch('/addtomovie/:Id', characterController_1.default.addToMovie);
router.patch('/removefrommovie/:Id', characterController_1.default.removeFromMovie);
module.exports = router;
