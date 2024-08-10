import { Schema } from "mongoose";

const movieSchema = new Schema({
    imdbID: String,
    title: String,
    year: Number,
    poster: String,

});

export default movieSchema;