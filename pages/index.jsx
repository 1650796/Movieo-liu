import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import styles from "../styles/Home.module.css";
import Header from "../components/header";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
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

export default function Home(props) {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Head>
        <title>Movieo Homepage</title>
        <meta name="description" content="Movieo" />
        <link rel="icon" href="/filmblack.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} name={props?.user?.name} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Movieo!
        </h1>

        <p className={styles.description}>
          A simple app to track your favorite movies and shows. 
        </p>
        <p>
          Login or sign up to start adding your favorites!
        </p>


        <div className={styles.grid}>
          {props.isLoggedIn ? (
            <>
              <Link href="/favorites" className={styles.card}>
                <h2>Favorites &rarr;</h2>
              </Link>
              <Link href="/search" className={styles.card}>
                <h2>Search &rarr;</h2>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.card}>
                <h2>Login &rarr;</h2>
              </Link>

              <Link href="/signup" className={styles.card}>
                <h2>Create Account &rarr;</h2>
              </Link>
            </>
          )}
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
