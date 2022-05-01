import express from 'express';
import morgan from 'morgan';
import characterRoutes from './routes/characterRoutes';
import movieRoutes from './routes/movieRoutes';

// Initializing app
const app = express()

// Using morgan logger if app is in development
app.use(morgan('dev'))

// Allowing app to parse json in request body
app.use(express.json())

// Connecting routers
app.use('/api/v1/characters', characterRoutes) 
app.use('/api/v1/movies', movieRoutes)

export = app