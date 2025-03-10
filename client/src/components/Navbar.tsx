import styles from './css/navbar.module.css';

interface Props {
    heading: string;
}

export default function Navbar({heading}: Props) {
    return (
        <nav className={styles.nav}>
            <h1 className={styles.heading}>{heading}</h1>
        </nav>
    )
}