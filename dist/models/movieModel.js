"use strict";
const mongoose_1 = require("mongoose");
// The schema for the movie resource
const movieSchema = new mongoose_1.Schema({
    title: { type: String, required: [true, 'All movies must have titles'], unique: true },
    dateOfCreation: { type: Date, required: [true, 'All movies must have date cration'] },
    characters: [{ type: mongoose_1.Types.ObjectId, ref: 'Character' }]
});
// Running a pre function to populate the characters field in the movie resource(s) for every query that has a find
movieSchema.pre(/^find/, function (next) {
    this.populate({ path: 'characters', select: '-movies' });
    next();
});
movieSchema.methods.characterIds = function (charId) {
    const ids = [];
    this.characters.map((character) => {
        ids.push(character.id);
    });
    // console.log(ids, charId)
    if (ids.includes(charId)) {
        return true;
    }
    else {
        return false;
    }
};
// Initializing the model
const Movie = (0, mongoose_1.model)('Movie', movieSchema);
module.exports = Movie;
