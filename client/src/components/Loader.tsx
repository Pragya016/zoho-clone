import { CircularProgress } from "@mui/material";
import styles from './css/loader.module.css';

export default function Loader() {
    return (
        <div id={styles.loaderContainer}>
            <CircularProgress />
        </div>
    )
}