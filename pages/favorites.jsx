import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import styles from "../styles/Home.module.css";
import Header from "../components/header";
import MoviePreview from "../components/moviePreview/moviePreview";
import db from "../db";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const favoriteMovies = await db.movie.getFavorites(user._id);
    console.log(favoriteMovies);

    return {       
      props: {
        user: req.session.user,
        isLoggedIn: true,
        favoriteMovies: favoriteMovies,
      }
    };
  },
  sessionOptions
);

export default function Favorites(props) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Movieo Favorites</title>
        <meta name="description" content="Movieo" />
        <link rel="icon" href="/filmblack.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} name={props?.user?.name} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Your Favorites
        </h1>

        <p className={styles.description}>
          Here are your recently-favorited movies/shows:
        </p>
        {
        props.favoriteMovies?.length > 0
        ? (
        <div className={styles.list}> 
          {props.favoriteMovies.map((movie) => (
            <div>
          {movie.Poster !== "N/A" ? (
            <MoviePreview
              key={movie.imdbID}
              imdbID={movie.imdbID}
              title={movie.Title}
              poster={movie.Poster}
            />
            ) : (
            <MoviePreview
              key={movie.imdbID}
              imdbID={movie.imdbID}
              title={movie.Title}
            />
            )}
            </div>
            )
          )}
        </div>
        )
        : <p>You currently don't have any titles saved.</p>
      }

        <div className={styles.grid}>
          <Link href="/" className={styles.card}>
            <h2>Home &rarr;</h2>
          </Link>
          <Link href="/search" className={styles.card}>
            <h2>Search &rarr;</h2>
          </Link>
        </div>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
