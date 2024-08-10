import Head from 'next/head'
import { useRouter } from "next/router"
import { useState } from 'react';
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../../config/session";
import Header from '../../components/header'
import db from '../../db'
import styles from '../../styles/Home.module.css'


export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, params }) {
    const user = req.session.user;
    const imdbID = params.id;
    const props = {};

    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;

      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API}&i=${imdbID}`);
      const movieData = await response.json();
      if (movieData) {
        props.movie = movieData;
        console.log(movieData);
      }
      const favorites = await db.movie.getFavorites(user._id);
      props.isFavoriteMovie = favorites;
    }
    props.isLoggedIn = !!user;

    return { props };
  },
  sessionOptions
);

export default function Movie(props) {
  const router = useRouter()
  let movie = props.movie;
  let favorites = props.isFavoriteMovie;
  const [isFavoriteMovie, setIsFavoriteMovie] = useState(favorites);


  async function addToFavorites(e) {
    e.preventDefault()
    try {
      const res = await fetch('/api/movie', {
        method: 'POST',
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(movie)
      })
      if (res.status === 200) {
        setIsFavoriteMovie(true);
        router.replace(router.asPath)
        console.log("Movie/show added to favorites", movie )
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function removeFromFavorites(e) {
    e.preventDefault()
    try {
      const res = await fetch('/api/movie', {
        method: 'DELETE',
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({imdbID: movie.imdbID}),
      })
      if (res.status === 200) {
        setIsFavoriteMovie(false);
        router.replace(router.asPath)
        console.log("Movie/show removed from favorites", movie)    
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Movie/Show Information</title>
        <meta name="description" content="Viewing a specific movie/show" />
        <link rel="icon" href="/filmblack.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} name={props?.user?.name} />

      <main className={styles.main}>
      {movie &&
        <div>
        {movie.Poster !== "N/A" ? (
          <MovieInfo
            key={movie.imdbID}
            isFavorite={movie.isFavoriteMovie}
            title={movie.Title}
            year={movie.Year}
            poster={movie.Poster}
            director={movie.Director}
            genre={movie.Genre}
            actors={movie.Actors}
            country={movie.Country}
            plot={movie.Plot}
          />
          ) : (
          <MovieInfo
            key={movie.imdbID}
            isFavorite={movie.isFavoriteMovie}
            title={movie.Title}
            year={movie.Year}
            director={movie.Director}
            genre={movie.Genre}
            actors={movie.Actors}
            country={movie.Country}
            plot={movie.Plot}
          />
          )}
        </div>
      }
        <div>
          {
            movie.isFavoriteMovie
            ? <button onClick={removeFromFavorites}>
                Remove from Favorites
              </button>
            : <button onClick={addToFavorites}>
                Add to Favorites
              </button>
          }
        </div>
      </main>
    </div>
  )}

  function MovieInfo({
    isFavorite,
    title,
    year,
    poster,
    director,
    genre,
    actors,
    country,
    plot
  }) {
    return (
      <>
        <div className={styles.container}>
          <img src={poster
            ? poster
            : "https://via.placeholder.com/128x190?text=NO POSTER"} 
            alt={title} 
          />
          <h2>{title} {isFavorite && <sup>⭐</sup>}</h2>
          <h3>{year}</h3>
        {
          director && director.length > 0 &&
          <p>Directed by {director}</p>
        }
        {
          genre && genre.length > 0 &&
          <p>Genre: {genre}</p>
        }
        {
          actors && actors.length > 0 &&
          <p>Featuring {actors}</p>
        }

      <p>Country: {country}</p>
      <p><br/>{plot}</p>
    </div>
      </>
    )
  }