import User from '../models/user'
import dbConnect  from '../connection'
//import normalize from '../normalize'

export async function searchMovies(query) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=f47eb4f1&s=${query}`)
  if (response.status !== 200)
    return null
  const data = await response.json()
  return data.Search
}

export async function getFavorites(userId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  if (!user) return null
  return JSON.parse(JSON.stringify(user.favoriteMovies));
  //return user.favoriteMovies.map(movie => normalize(movie))
}

export async function addFave(userId, movie) {
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favoriteMovies: movie } },
    { new: true }
  )
  if (!user) return null
  const addedMovie = user.favoriteMovies.find(mv => mv.imdbID === movie.imdbID)
  console.log(addedMovie)
  //return normalize(addedMovie)
}

export async function removeFave(userId, imdbID) {
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favoriteMovies: {_id: imdbID } } },
    { new: true }
  )
  console.log("Removed", imdbID)
  if (!user) return null
  return true
}