import Head from 'next/head'
import { useRouter } from "next/router"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../../config/session";
import Header from '../../components/header'
import db from '../../db'
import styles from '../../styles/Home.module.css'


export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, params }) {
    const { user } = req.session;
    const props = {};

    if (user) {
      props.user = req.session.user;
      const movie = await db.movie.getByImbdId(req.session.user.id, params.id)
      props.isLoggedIn = true;
      if (movie)
        props.movie = movie
    } else {
        props.isLoggedIn = false;
    }
    return { props };
  },
  sessionOptions
);

export default function Movie(props) {
  const router = useRouter()
  const { id } = router.query
  const { isLoggedIn } = props
  const [movieInfo, setMovieInfo] = useState(null)

  async function movieDetails(imdbID) {
    try {
      const res = await fetch (
        `https://www.omdbapi.com/?apikey=f47eb4f1&i=${imdbID}`
      )
      const movieData = await res.json()
      setMovieInfo(movieData)
      console.log(movieInfo)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  }
  useEffect(() => {
    if (id) {
      movieDetails(id)
    }
  }, [id])


  async function addToFavorites(e) {
    e.preventDefault()
    const res = await fetch('/api/movie', {
      method: 'POST',
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(...movieInfo)
    })
    if (res.status === 200) {
      router.replace(router.asPath)
      console.log("Movie/show added to favorites", ...movieInfo)
    }
  }
  async function removeFromFavorites(e) {
    e.preventDefault()
    const res = await fetch('/api/movie', {
      method: 'DELETE',
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ imdbID: movieInfo.imdbID})
    })
    if (res.status === 200) {
      router.replace(router.asPath)
      console.log("Movie/show removed from favorites", movieInfo)    
    }

  }

  return (
    <>
      <Head>
        <title>Movie/Show Information</title>
        <meta name="description" content="Viewing a specific movie/show" />
        <link rel="icon" href="/filmblack.png" />
      </Head>
      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      {
        movieInfo &&
        <main className={styles.main}>
          <div className={styles.container}>
            <div>
              <h1>{movieInfo.Title}</h1>
              <h2>{movieInfo.Year}</h2>
              {
                movieInfo.Director && movieInfo.Director.length > 0 &&
                <p>Director: {movieInfo.Director}</p>
              }
              {
                movieInfo.Genre && movieInfo.Genre.length > 0 &&
                <p>Genre: {movieInfo.Genre}</p>
              }
              {
                movieInfo.Actors && movieInfo.Actors.length > 0 &&
                <p>Actors: {movieInfo.Actors}</p>
              }

            <p>Country: {movieInfo.Country}</p>
            <p><br/>{movieInfo.Plot}</p>
            </div>
            <img src={movieInfo.Poster
                ? movieInfo.Poster
                : "https://via.placeholder.com/128x190?text=NO POSTER"} alt={movieInfo.Title} />
          </div>

          <div className={styles.controls}>
            {
              isLoggedIn
              ? <>
                  <p>Want to add this movie to your favorites?</p>
                </>
              : isFavoriteMovie
              ? <button onClick={removeFromFavorites}>
                  Remove from Favorites
                </button>
              : <button onClick={addToFavorites}>
                  Add to Favorites
                </button>
            }

            <a href="#" onClick={() => router.back()}>
              Return
            </a>
          </div>
        </main>
      }
    </>
  )
}
