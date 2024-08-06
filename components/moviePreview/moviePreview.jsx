import styles from "./style.module.css";
import Link from "next/link";

export default function MoviePreview ({
    imdbID,
    poster,
    title
}) {
    return (
        <div className={styles.preview}>
            <Link 
                href={`/movie/${imdbID}`} 
            >
            <img
                src={poster ? poster : "https://via.placeholder.com/128x190?text=NO POSTER"}
                alt={title} 
            />
            <h2>{title}</h2>
            </Link>                       
        </div>
    )
}