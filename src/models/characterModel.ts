import { Schema, model, Types } from 'mongoose';

// Interface to construct the schema on
interface ICharacter{
    firstName: string
    lastName: string
    gender: string
    email: string
    phone: string
    address: string
    bio: string
    age: number
    movies: Array<Types.ObjectId>
}

// The schema for the character resource
const characterSchema = new Schema<ICharacter>({
    firstName: { type: String, required: [true, 'Every character must have a first name'] },
    lastName: { type: String, required: [true, 'Every character must have a last name'] },
    gender: { type: String, required: [true, 'Every character must have a gender'] },
    email: { type: String, required: [true, 'Every character must have an email'] },
    phone: { type: String, required: [true, 'Every character must have a phone number'] }, 
    address: { type: String, required: [true, 'Every character must have an address'] }, 
    bio: { type: String, required: [true, 'Every character must have a bio'] },
    age: { type: Number, required: [true, 'Every character must have an age'] }, 
    movies: [{type: Types.ObjectId, ref: 'Movie'}]
})

// Running a pre function to populate the movies field in the character resource(s) for every query that has a find
characterSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'movies',
        select: '-characters' // Removing the characters array in the movies field
    })
    next();
})

// Initializing the model
const Character = model('Character', characterSchema)

// Exporting the model
export = Character