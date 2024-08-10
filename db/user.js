import User from './models/user'
import dbConnect from './connection'

export async function create(name, username, password) {
  if (!(name && username && password))
    throw new Error('Must include name, username, and password')

  await dbConnect()

  const user = await User.create({name, username, password})

  if (!user)
    throw new Error('Error inserting User')

  return user.toJSON()
}
