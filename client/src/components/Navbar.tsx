import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import styles from './css/navbar.module.css';

interface Props {
    heading: string;
}

export default function Navbar({heading}: Props) {
    return (
        <nav className={styles.nav}>
            <div className={styles.box}>
                <ArrowForwardIosIcon sx={{marginRight: '5px'}}/>
                <h1 className={styles.heading}>{heading}</h1>
            </div>
        </nav>
    )
}