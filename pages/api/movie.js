import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

export default withIronSessionApiRoute(
  async function handler(req, res) {
    if (!req.session.user) {
      return res.status(401).json({ error: "You are not authorized to access this page." })
    }

    switch(req.method) {
    case 'POST':
      try {
        const movie = req.body
        const addMovie = await db.movie.addFave(req.session.user.id, movie)

        if (addMovie === null) {
          req.session.destroy()
          return res.status(401).json({ error: "User not found." })
        } else {
          return res.status(200).json("Movie/show added to favorites.")
        }
      } catch (err) {
        return res.status(400).json({ error: err.message })
      }
      
    case 'DELETE':
      try {
        const removeMovie = await db.movie.remove(req.session.user.id, req.body.id)

        if (removeMovie === null) {
          req.session.destroy()
          return res.status(401).json({ error: "User not found." })
        } else {
          return res.status(200).json("Movie/show removed from favorites.")
        }
      } catch (err) {
        return res.status(400).json({ error: err.message })
      }

    default:
      return res.status(404).end()    
    }
  },
  sessionOptions
)
