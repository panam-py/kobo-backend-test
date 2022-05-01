import { Schema, model, Types } from 'mongoose'


// Interface to construct the schema on
interface IMovie {
    title: string
    dateOfCreation: Date
    characters: Array<Types.ObjectId>
}

// The schema for the movie resource
const movieSchema = new Schema<IMovie>({
    title: { type: String, required: [true, 'All movies must have titles'], unique: true },
    dateOfCreation: { type: Date, required: [true, 'All movies must have date cration'] },
    characters: [{type: Types.ObjectId, ref: 'Character'}]
})

// Running a pre function to populate the characters field in the movie resource(s) for every query that has a find
movieSchema.pre(/^find/, function (next) {
    this.populate({ path: 'characters', select: '-movies' })
    next()
})

movieSchema.methods.characterIds = function (charId: Types.ObjectId): boolean {
    const ids: Array<Types.ObjectId> = []
    this.characters.map((character: any) => {
        ids.push(character.id)
    })
    // console.log(ids, charId)
    if (ids.includes(charId)) {
        return true
    } else {
        return false
    }
}

// Initializing the model
const Movie = model('Movie', movieSchema)

// Exporting the model
export = Movie