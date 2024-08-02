import User from '../models/user'
import dbConnect  from '../connection'

export async function getAll(userId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  if (!user) return null
  return user.favoriteMovies.map(movie => normalize(movie))
}

export async function getByImbdId(userId, imdbId) {
  await dbConnect()
  const user = await User.findById(userId).lean()
  if (!user) return null
}

export async function addFave(userId, movie) {
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favoriteMovies: movie } },
    { new: true }
  )
  if (!user) return null
}

export async function remove(userId, imdbId) {
  await dbConnect()
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favoriteMovies: {_id: imdbId } } },
    { new: true }
  )
  if (!user) return null
  return true
}