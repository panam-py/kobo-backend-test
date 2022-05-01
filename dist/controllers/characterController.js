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
const characterModel_1 = __importDefault(require("../models/characterModel"));
const movieModel_1 = __importDefault(require("../models/movieModel"));
const utils_1 = __importDefault(require("../utils"));
const commonController_1 = __importDefault(require("./commonController"));
// Callback function to return all the characters found in the DB
const getAllCharacters = commonController_1.default.getAll(characterModel_1.default);
// Callback function to return a single character found in the DB based on an identifier
const getOneCharacter = commonController_1.default.getOne(characterModel_1.default);
// Callback function to delete a single character resource
const deleteCharacter = commonController_1.default.deleteOne(characterModel_1.default);
// Callback function to update a single character resource
const updateCharacter = commonController_1.default.update(characterModel_1.default, ['firstName', 'lastName', 'gender', 'email', 'phone', 'address', 'bio', 'age']);
// Callback function to create a new character in the DB
const createCharacter = (0, utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const gender = req.body.gender;
    const email = req.body.email;
    const phone = req.body.phone;
    const address = req.body.address;
    const bio = req.body.bio;
    const age = req.body.age;
    const movies = req.body.movies;
    if (!firstName || !lastName || !gender || !email || !phone || !address || !bio || !age || !movies) {
        return res.status(400).json({
            status: 'failed',
            message: "Please provide all of the following fields in request body: firstName, lastName, gender, email, phone, address, bio, age, movies"
        });
    }
    const moviesArr = movies.split(',');
    const notFound = [0];
    yield Promise.all(moviesArr.map((movieId) => __awaiter(void 0, void 0, void 0, function* () {
        const movieExists = yield movieModel_1.default.exists({ _id: movieId });
        if (!movieExists) {
            notFound[0]++;
            notFound.push(movieId);
        }
    })));
    if (notFound[0] > 0) {
        return res.status(400).json({
            status: 'failed',
            message: `${notFound[0]} movie(s) not found out of ${moviesArr.length}. The unrecognized Ids are: ${notFound.slice(1).join(', ')}`
        });
    }
    const newCharacter = {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        email: email,
        phone: phone,
        address: address,
        bio: bio,
        age: age,
        movies: moviesArr
    };
    const createdCharacter = yield characterModel_1.default.create(newCharacter);
    yield Promise.all(newCharacter.movies.map((movieId) => __awaiter(void 0, void 0, void 0, function* () {
        const movie = yield movieModel_1.default.findById(movieId).select("characters").lean();
        const movieChars = movie.characters;
        let newMovieChars = [...movieChars];
        newMovieChars.push(createdCharacter._id);
        yield movieModel_1.default.findByIdAndUpdate(movie._id, { "characters": newMovieChars });
        console.log("DONE");
    })));
    return res.status(201).json({
        status: 'success',
        message: 'Character created successfully',
        data: createdCharacter
    });
}));
// Callback function to add a character to a movie
const addToMovie = (0, utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { Id } = req.params;
    const movieId = req.body.movieId;
    if (!movieId) {
        return res.status(400).json({
            status: 'failed',
            message: 'Please provide movieId field in payloaad'
        });
    }
    const characterCheck = yield commonController_1.default.checkResource(characterModel_1.default, Id);
    const movieCheck = yield commonController_1.default.checkResource(movieModel_1.default, movieId);
    if (!characterCheck) {
        return res.status(404).json({
            status: 'failed',
            message: 'No character found with that Id'
        });
    }
    if (!movieCheck) {
        return res.status(404).json({
            status: 'failed',
            message: 'No movie found with that Id'
        });
    }
    const character = yield characterModel_1.default.findById(Id).lean();
    const movie = yield movieModel_1.default.findById(movieId);
    // console.log(movie.characterIds(character._id))
    if (movie.characterIds(String(character._id))) {
        return res.status(403).json({
            status: 'failed',
            message: 'Character already in movie'
        });
    }
    const movieArr = character.movies;
    movieArr.push(movieId);
    const charArr = movie.characters;
    charArr.push(character._id);
    const updatedChar = yield characterModel_1.default.findByIdAndUpdate(character._id, { "movies": movieArr }, { new: true, runValidators: true });
    yield movieModel_1.default.findByIdAndUpdate(String(movie._id), { "characters": charArr }, { new: true, runValidators: true });
    return res.status(200).json({
        status: 'success',
        message: 'Added character to movie successfully',
        data: updatedChar
    });
}));
const removeFromMovie = (0, utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { Id } = req.params;
    const movieId = req.body.movieId;
    if (!movieId) {
        return res.status(400).json({
            status: 'failed',
            message: 'Please provide movieId field in payloaad'
        });
    }
    const characterCheck = yield commonController_1.default.checkResource(characterModel_1.default, Id);
    const movieCheck = yield commonController_1.default.checkResource(movieModel_1.default, movieId);
    if (!characterCheck) {
        return res.status(404).json({
            status: 'failed',
            message: 'No character found with that Id'
        });
    }
    if (!movieCheck) {
        return res.status(404).json({
            status: 'failed',
            message: 'No movie found with that Id'
        });
    }
    const character = yield characterModel_1.default.findById(Id).lean();
    const movie = yield movieModel_1.default.findById(movieId);
    // console.log(movie.characterIds(character._id))
    if (!movie.characterIds(String(character._id))) {
        return res.status(403).json({
            status: 'failed',
            message: 'Character not in movie'
        });
    }
    const movieArr = character.movies;
    const newMovieArr = [];
    movieArr.map((arrMovie) => {
        if (String(arrMovie._id) != String(movie._id)) {
            newMovieArr.push(arrMovie._id);
        }
    });
    const charArr = movie.characters;
    const newCharArr = [];
    charArr.map((char) => {
        if (String(char._id) != String(character._id)) {
            newCharArr.push(char._id);
        }
    });
    const updatedChar = yield characterModel_1.default.findByIdAndUpdate(character._id, { "movies": newMovieArr }, { new: true, runValidators: true });
    yield movieModel_1.default.findByIdAndUpdate(String(movie._id), { "characters": newCharArr }, { new: true, runValidators: true });
    return res.status(200).json({
        status: 'success',
        message: 'Removed character from movie successfully',
        data: updatedChar
    });
}));
module.exports = {
    getAllCharacters,
    getOneCharacter,
    createCharacter,
    deleteCharacter,
    updateCharacter,
    addToMovie,
    removeFromMovie
};
