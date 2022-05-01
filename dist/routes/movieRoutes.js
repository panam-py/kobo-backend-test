"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const movieController_1 = __importDefault(require("../controllers/movieController"));
const router = express_1.default.Router();
router.route('/').get(movieController_1.default.getAllMovies).post(movieController_1.default.createMovie);
router.route('/:Id').get(movieController_1.default.getOneMovie).delete(movieController_1.default.deleteOneMovie).patch(movieController_1.default.updateMovie);
module.exports = router;
