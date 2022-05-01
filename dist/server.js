"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
// Setting environment variables
dotenv_1.default.config({ 'path': __dirname + '/.env' });
let DB;
const PORT = process.env.PORT;
// Setting DB based on environment
if (process.env.ENV === "development") {
    DB = process.env.DB_DEV;
}
else {
    DB = process.env.DB_PROD;
}
// Reconstructing DB to string
DB = String(DB);
// Connecting to the database
mongoose_1.default.connect(DB).then(() => console.log("DB CONNECTED SUCESSFULLY")).catch((err) => console.log("AN ERROR OCCURED WHILE CONNECTING TO DB ", err));
// Running the server
app_1.default.listen(PORT, () => {
    console.log(`APP RUNNING ON PORT ${PORT}`);
});
