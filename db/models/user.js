import { Schema, model, models } from 'mongoose'
import bcrypt from 'bcrypt'
import movieSchema from './movie'

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 50
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 200
  },
  favoriteMovies: [movieSchema]
})

// hashes the password before it's stored in mongo
UserSchema.pre('save', async function(next) {
  if (this.isNew)
    this.password = await bcrypt.hash(this.password, 10)
  next()
})

export default models.User || model('User', UserSchema)