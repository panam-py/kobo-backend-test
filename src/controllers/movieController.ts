import Movie from "../models/movieModel";
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils';
import commonController from './commonController'


// Callback function to return all the movies found in the DB
const getAllMovies = commonController.getAll(Movie);

// Callback function to return a single movie found in the DB based on an identifier
const getOneMovie = commonController.getOne(Movie)

// Callback function to deete one movie from the DB
const deleteOneMovie = commonController.deleteOne(Movie)

// Callback function to update a movie
const updateMovie = commonController.update(Movie, ['title'])

// Callback function to create a movie into the DB
const createMovie = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const title: string  = req.body.title;

    // Returning a bad request res if title is not in request body
    if (!title) {
        return res.status(400).json({
            status: 'failed',
            message: "Please provide 'title' in request body"
        })
    }

    // Interface for movie creation
    interface IMovieCreate{
        title: string
        dateOfCreation: Date
        movies: Array<string>
    }

    // Making an instance if the interface
    const newMovie: IMovieCreate = {
        title,
        dateOfCreation: new Date(Date.now()),
        movies: []
    }

    // Creating the movie and returning it in the response
    const createdMovie: Object = await Movie.create(newMovie)
    return res.status(201).json({
        status: 'success',
        message: 'Movie successfully created',
        data: createdMovie
    })
})

export = {
    getAllMovies,
    getOneMovie,
    createMovie,
    deleteOneMovie,
    updateMovie
}

