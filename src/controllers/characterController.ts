import Character from "../models/characterModel";
import Movie from "../models/movieModel";
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils';
import commonController from './commonController'

interface ICharacter {
    firstName: string
    lastName: string
    gender: string
    email: string
    phone: string
    address: string
    bio: string
    age: number
    movies: Array<string>
}

// Callback function to return all the characters found in the DB
const getAllCharacters = commonController.getAll(Character);

// Callback function to return a single character found in the DB based on an identifier
const getOneCharacter = commonController.getOne(Character);

// Callback function to delete a single character resource
const deleteCharacter = commonController.deleteOne(Character)

// Callback function to update a single character resource
const updateCharacter = commonController.update(Character, ['firstName', 'lastName', 'gender', 'email', 'phone', 'address', 'bio', 'age'])

// Callback function to create a new character in the DB
const createCharacter = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const firstName: string = req.body.firstName;
    const lastName: string = req.body.lastName;
    const gender: string = req.body.gender;
    const email: string = req.body.email;
    const phone: string = req.body.phone;
    const address: string = req.body.address;
    const bio: string = req.body.bio;
    const age: number = req.body.age;
    const movies: string = req.body.movies;

    if (!firstName || !lastName || !gender || !email || !phone || !address || !bio || !age || !movies) {
        return res.status(400).json({
            status: 'failed',
            message: "Please provide all of the following fields in request body: firstName, lastName, gender, email, phone, address, bio, age, movies"
        })
    }

    const moviesArr: Array<string> = movies.split(',')
    
    const notFound: Array<any> = [0]
    await Promise.all(moviesArr.map(async (movieId) => {
        const movieExists = await Movie.exists({ _id: movieId })
        if (!movieExists) {
            notFound[0]++;
            notFound.push(movieId)
        }
    }))

    if (notFound[0] > 0) {
        return res.status(400).json({
            status: 'failed',
            message: `${notFound[0]} movie(s) not found out of ${moviesArr.length}. The unrecognized Ids are: ${notFound.slice(1,).join(', ')}`
        })
    }

    const newCharacter: ICharacter = {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        email: email,
        phone: phone,
        address: address,
        bio: bio,
        age: age,
        movies: moviesArr
    }

    const createdCharacter = await Character.create(newCharacter)

    await Promise.all(newCharacter.movies.map(async (movieId) => {
        const movie: any = await Movie.findById(movieId).select("characters").lean()
        const movieChars = movie.characters
        let newMovieChars = [...movieChars]
        newMovieChars.push(createdCharacter._id)
        await Movie.findByIdAndUpdate(movie._id, { "characters": newMovieChars })
        console.log("DONE")
    }))

    return res.status(201).json({
        status: 'success',
        message: 'Character created successfully',
        data: createdCharacter
    })
});

// Callback function to add a character to a movie
const addToMovie = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { Id } = req.params;
    const movieId = req.body.movieId;

    if (!movieId) {
        return res.status(400).json({
            status: 'failed',
            message: 'Please provide movieId field in payloaad'
        })
    }

    const characterCheck: boolean = await commonController.checkResource(Character, Id) 
    const movieCheck: boolean = await commonController.checkResource(Movie, movieId)

    if (!characterCheck) {
        return res.status(404).json({
            status: 'failed',
            message: 'No character found with that Id'
        })
    }

    if (!movieCheck) {
         return res.status(404).json({
            status: 'failed',
            message: 'No movie found with that Id'
        })
    }

    const character: any = await Character.findById(Id).lean()
    const movie: any = await Movie.findById(movieId)

    // console.log(movie.characterIds(character._id))
    if (movie.characterIds(String(character._id))){
        return res.status(403).json({
            status: 'failed',
            message: 'Character already in movie'
        })
    }

    const movieArr: Array<string> = character.movies
    movieArr.push(movieId)
    const charArr: Array<string> = movie.characters
    charArr.push(character._id)

    
    const updatedChar: Object | null = await Character.findByIdAndUpdate(character._id, { "movies": movieArr }, { new: true, runValidators: true })
    await Movie.findByIdAndUpdate(String(movie._id), { "characters": charArr }, { new: true, runValidators: true })
    
    return res.status(200).json({
        status: 'success',
        message: 'Added character to movie successfully',
        data: updatedChar
    })
})

const removeFromMovie = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { Id } = req.params;
    const movieId = req.body.movieId;

    if (!movieId) {
        return res.status(400).json({
            status: 'failed',
            message: 'Please provide movieId field in payloaad'
        })
    }

    const characterCheck: boolean = await commonController.checkResource(Character, Id) 
    const movieCheck: boolean = await commonController.checkResource(Movie, movieId)

    if (!characterCheck) {
        return res.status(404).json({
            status: 'failed',
            message: 'No character found with that Id'
        })
    }

    if (!movieCheck) {
         return res.status(404).json({
            status: 'failed',
            message: 'No movie found with that Id'
        })
    }

    const character: any = await Character.findById(Id).lean()
    const movie: any = await Movie.findById(movieId)

    // console.log(movie.characterIds(character._id))
    if (!movie.characterIds(String(character._id))){
        return res.status(403).json({
            status: 'failed',
            message: 'Character not in movie'
        })
    }

    const movieArr: Array<Object> = character.movies
    const newMovieArr: Array<string> = []
    movieArr.map((arrMovie: any) => {
        if (String(arrMovie._id) != String(movie._id)) {
            newMovieArr.push(arrMovie._id)
        }
    })

    const charArr: Array<Object> = movie.characters
    const newCharArr: Array<Object> = [] 
    charArr.map((char: any) => {
        if (String(char._id) != String(character._id)) {
            newCharArr.push(char._id)
        }
    })


    const updatedChar: Object | null = await Character.findByIdAndUpdate(character._id, { "movies": newMovieArr }, { new: true, runValidators: true })
    await Movie.findByIdAndUpdate(String(movie._id), { "characters": newCharArr }, { new: true, runValidators: true })
    
    return res.status(200).json({
        status: 'success',
        message: 'Removed character from movie successfully',
        data: updatedChar
    })
})


export = {
    getAllCharacters,
    getOneCharacter,
    createCharacter,
    deleteCharacter,
    updateCharacter,
    addToMovie,
    removeFromMovie
}