import styles from "./style.module.css";
import Link from "next/link";
import useLogout from "../../hooks/useLogout";
import Image from "next/image";

export default function Header(props) {
  const logout = useLogout();
  return (
    <header className={styles.container}>
      {props.isLoggedIn ? (
        <>
          <p>
            <Link href="/">
              <Image src="/film.png" alt="Movieo Logo" width={80} height={80} />
            </Link>
          </p>
          <div className={styles.menu}>
            <p className={styles.name}>Welcome, {props.name}!</p>
            <p>
              <Link href="/search">Search</Link>
            </p>
            <p>
              <Link href="/favorites">Favorites</Link>
            </p>
            <p onClick={logout} style={{ cursor: "pointer" }}>
              Logout
            </p>
          </div>
        </>
      ) : (
        <>
          <p>
            <Link href="/">
              <Image src="/film.png" alt="Movieo Logo" width={100} height={100} />
            </Link>
          </p>
          <div className={styles.menu}>
          <p>
            <Link href="/login">Login</Link>
          </p>
          <p>
            <Link href="/signup">Signup</Link>
          </p>
          </div>
          
        </>
      )}
    </header>
  );
}

