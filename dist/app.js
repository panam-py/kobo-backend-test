"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const characterRoutes_1 = __importDefault(require("./routes/characterRoutes"));
const movieRoutes_1 = __importDefault(require("./routes/movieRoutes"));
// Initializing app
const app = (0, express_1.default)();
// Using morgan logger if app is in development
app.use((0, morgan_1.default)('dev'));
// Allowing app to parse json in request body
app.use(express_1.default.json());
// Connecting routers
app.use('/api/v1/characters', characterRoutes_1.default);
app.use('/api/v1/movies', movieRoutes_1.default);
module.exports = app;
