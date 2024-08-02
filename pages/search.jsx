import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";
import sessionOptions from "../config/session";
import Header from '../components/header';
import { useState } from 'react';
import styles from '../styles/Movies.module.css';
import Link from "next/link";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const { user } = req.session;
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }
    return { props };
  },
  sessionOptions
);

export default function Search(props) {
  const [query, setQuery] = useState("")
  const [fetching, setFetching] = useState(false)
  const [movieInfo, setMovieInfo] = useState([])

  async function handleSubmit(e) {
    e.preventDefault()
    if (fetching || !query.trim()) return
    setFetching(true)
    try {
        const res = await fetch(
            `https://www.omdbapi.com/?apikey=f47eb4f1&s=${query}`
        )
        const movieData = await res.json()
        console.log(movieData)
        if (movieData.Search){
            setMovieInfo(movieData.Search)
            setQuery("")
        }
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
    setFetching(false)
  }

  return (
    <>
      <Head>
        <title>Search Page</title>
        <meta name="description" content="Movieo search page" />
        <link rel="icon" href="/filmblack.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />
      <main>
        <h1 className={styles.title}>Search</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="movie-search">Search by movie/show title:</label>
          <div>
            <input
              type="text"
              name="movie-search"
              id="movie-search"
              value={query}
              autoFocus={true}
              onChange={e => setQuery(e.target.value)}/>
            <button type="submit">Submit</button>
          </div>
        </form>

        {fetching && (
           <Loading />
        )}

        <div className={[styles.container, styles.list]}>
            {movieInfo && movieInfo.length > 0 && (
                movieInfo.map((movie) => (
                  <div key={movie.imdbID}>
                    {movie.Poster === "N/A" ? (
                        <Link 
                        href={`/movie/${movie.imdbID}`} 
                        style={{textDecoration: 'none'}}
                        >
                        <img
                        src="https://via.placeholder.com/128x190?text=NO POSTER"
                        alt={movie.Title} />
                        </Link>
                    ) : (
                        <Link 
                        href={`/movie/${movie.imdbID}`} 
                        style={{textDecoration: 'none'}}
                        >
                        <img
                        src={movie.Poster}
                        alt={movie.Title} />
                        </Link>
                    )}
                    </div>
                ))
            )}
            </div>

            {movieInfo.length === 0 && (
                <p>No movies/shows found. Try again?</p>
            )}
      </main>
    </>
  )
}

function Loading() {
  return <span className={styles.loading}>Loading...</span>
}
