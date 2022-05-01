"use strict";
const mongoose_1 = require("mongoose");
// The schema for the character resource
const characterSchema = new mongoose_1.Schema({
    firstName: { type: String, required: [true, 'Every character must have a first name'] },
    lastName: { type: String, required: [true, 'Every character must have a last name'] },
    gender: { type: String, required: [true, 'Every character must have a gender'] },
    email: { type: String, required: [true, 'Every character must have an email'] },
    phone: { type: String, required: [true, 'Every character must have a phone number'] },
    address: { type: String, required: [true, 'Every character must have an address'] },
    bio: { type: String, required: [true, 'Every character must have a bio'] },
    age: { type: Number, required: [true, 'Every character must have an age'] },
    movies: [{ type: mongoose_1.Types.ObjectId, ref: 'Movie' }]
});
// Running a pre function to populate the movies field in the character resource(s) for every query that has a find
characterSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'movies',
        select: '-characters' // Removing the characters array in the movies field
    });
    next();
});
// Initializing the model
const Character = (0, mongoose_1.model)('Character', characterSchema);
module.exports = Character;
