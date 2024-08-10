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
  let movies = props.movies;

  function handleSubmit(e) {
    e.preventDefault()
    try {
      if (!query.trim() || query === previousQuery) return
      setPreviousQuery(query)
      router.replace(router.pathname + `?q=${query}`);

    } catch (err) {
        console.log(err);    
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Search Page</title>
        <meta name="description" content="Search for movies or shows." />
        <link rel="icon" href="/filmblack.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} name={props?.user?.name} />

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
        !movies && previousQuery 
        ? <Loading />
        : movies?.length > 0
        ? (
        <div className={styles.list}> 
          {movies.map((movie) => (
            <div key={movie.imdbID}>
          {movie.Poster !== "N/A" ? (
            <MoviePreview
              //key={movie.imdbID}
              imdbID={movie.imdbID}
              title={movie.Title}
              poster={movie.Poster}
            />
            ) : (
            <MoviePreview
              //key={movie.imdbID}
              imdbID={movie.imdbID}
              title={movie.Title}
            />
            )}
            </div>
            )
          )}
        </div>
        )
        : previousQuery && <p>No movies or shows found. Try again?</p>
      }
      </main>
    </div>
    )}


function Loading() {
  return <span className={styles.loading}>Loading...</span>
}

