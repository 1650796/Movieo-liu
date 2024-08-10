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
        const addMovie = await db.movie.addFave(req.session.user._id, movie)
        console.log(addMovie)
        return res.status(200).json("Movie/show added to favorites.")
        
      } catch (err) {
        return res.status(400).json({ error: err.message })
      }
      
    case 'DELETE':
      try {
        const removeMovie = await db.movie.removeFave(req.session.user._id, req.body.id)
        console.log(removeMovie)
        return res.status(200).json("Movie/show removed from favorites.")
        
      } catch (err) {
        return res.status(400).json({ error: err.message })
      }

    default:
      return res.status(404).end()    
    }
  },
  sessionOptions
)
