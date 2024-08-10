import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Header from "../components/header";


export default function Signup(props) {
  const router = useRouter();
  const [
    { name, username, password, "confirm-password": confirmPassword },
    setForm,
  ] = useState({
    name: "",
    username: "",
    password: "",
    "confirm-password": "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      name,
      username,
      password,
      "confirm-password": confirmPassword,
      ...{ [e.target.name]: e.target.value.trim() },
    });
  }
  async function handleCreateAccount(e) {
    e.preventDefault();
    if (!name) return setError("Must include name");
    if (!username) return setError("Must include username");
    if (password !== confirmPassword) return setError("Passwords must Match");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name, username, password }),
      });
      if (res.status === 200) return router.push("/");
      const { error: message } = await res.json();
      setError(message);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Signup Page</title>
        <meta name="description" content="Movieo signup page" />
        <link rel="icon" href="/filmblack.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Signup
        </h1>

        <form
          className={styles.form}
          onSubmit={handleCreateAccount}
        >
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            name="name"
            id="name"
            onChange={handleChange}
            value={name}
          />          
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={handleChange}
            value={username}
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={password}
          />
          <label htmlFor="confirm-password">Confirm Password: </label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            onChange={handleChange}
            value={confirmPassword}
          />
          <button>Submit</button>
          {error && <p>{error}</p>}
        </form>
        <p> Already have an account?
        <Link href="/signup"> Login!
        </Link>
        </p>
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
