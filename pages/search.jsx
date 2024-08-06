import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";
import sessionOptions from "../config/session";
import Header from '../components/header';
import { useState } from 'react';
import { useRouter } from 'next/router'
import { searchMovies } from "../db/controllers/movie";
import MoviePreview from "../components/moviePreview/moviePreview";
import styles from '../styles/Home.module.css';


export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, query }) {
    const { user } = req.session;
    const props = {};

    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
      if (query.q) {
        props.movies = await searchMovies(query.q)
        console.log(props.movies)
      }
    } else {
      props.isLoggedIn = false;
    }
    return { props };
  },
  sessionOptions
);

export default function Search(props) {
  const [query, setQuery] = useState("")
  const [previousQuery, setPreviousQuery] = useState()
  const router = useRouter()
  const [fetching, setFetching] = useState(false)
  let movies = props.movies;

  function handleSubmit(e) {
    e.preventDefault()
    try {
      if (fetching || !query.trim() || query === previousQuery) return
      setPreviousQuery(query)
      setFetching(true)
      router.replace(router.pathname + `?q=${query}`)

    } catch (err) {
        return res.status(400).json({ error: err.message })     
    }
    setFetching(false)
  }

  return (
    <>
      <Head>
        <title>Search Page</title>
        <meta name="description" content="Search for movies or shows." />
        <link rel="icon" href="/filmblack.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main className={styles.main}>
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

        {
        fetching 
        ? <Loading />
        : movies?.length > 0
        ? <section>
          {movies.map((movie) => (
            <MoviePreview
              key={movie.imdbID}
              imdbID={movie.imdbID}
              title={movie.Title}
              poster={movie.Poster}
              />
            )
          )}
        </section>
        : <p>No movies/shows found. Try again?</p>
      }

      </main>
    </>
    )}


function Loading() {
  return <span className={styles.loading}>Loading...</span>
}

