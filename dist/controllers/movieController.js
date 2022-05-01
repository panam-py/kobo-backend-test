"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const movieModel_1 = __importDefault(require("../models/movieModel"));
const utils_1 = __importDefault(require("../utils"));
const commonController_1 = __importDefault(require("./commonController"));
// Callback function to return all the movies found in the DB
const getAllMovies = commonController_1.default.getAll(movieModel_1.default);
// Callback function to return a single movie found in the DB based on an identifier
const getOneMovie = commonController_1.default.getOne(movieModel_1.default);
// Callback function to deete one movie from the DB
const deleteOneMovie = commonController_1.default.deleteOne(movieModel_1.default);
// Callback function to update a movie
const updateMovie = commonController_1.default.update(movieModel_1.default, ['title']);
// Callback function to create a movie into the DB
const createMovie = (0, utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    // Returning a bad request res if title is not in request body
    if (!title) {
        return res.status(400).json({
            status: 'failed',
            message: "Please provide 'title' in request body"
        });
    }
    // Making an instance if the interface
    const newMovie = {
        title,
        dateOfCreation: new Date(Date.now()),
        movies: []
    };
    // Creating the movie and returning it in the response
    const createdMovie = yield movieModel_1.default.create(newMovie);
    return res.status(201).json({
        status: 'success',
        message: 'Movie successfully created',
        data: createdMovie
    });
}));
module.exports = {
    getAllMovies,
    getOneMovie,
    createMovie,
    deleteOneMovie,
    updateMovie
};
