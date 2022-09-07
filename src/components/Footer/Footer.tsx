import React from 'react';
import styles from './footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.wrapper}>
            <h1>Course work "Game store"</h1>
            <h2>Ivan Ivaniuk</h2>
        </footer>
    );
};

export default Footer;