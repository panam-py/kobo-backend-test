import mongoose from "mongoose";
import dotenv from 'dotenv';
import app from './app'

// Setting environment variables
dotenv.config({'path':__dirname + '/.env'})

let DB: string | undefined;
const PORT = process.env.PORT

// Setting DB based on environment
if (process.env.ENV === "development") {
    DB = process.env.DB_DEV
} else {
    DB = process.env.DB_PROD
}

// Reconstructing DB to string
DB = String(DB)

// Connecting to the database
mongoose.connect(DB).then(() => console.log("DB CONNECTED SUCESSFULLY")).catch((err) => console.log("AN ERROR OCCURED WHILE CONNECTING TO DB ", err))

// Running the server
app.listen(PORT, () => {
    console.log(`APP RUNNING ON PORT ${PORT}`)
});