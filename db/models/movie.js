import { Schema } from "mongoose";

const movieSchema = new Schema({
    imdbID: String,
    title: String,
    year: Number,
    director: [String],
    actors: [String],
    poster: String,
    plot: String
});

export default movieSchema;