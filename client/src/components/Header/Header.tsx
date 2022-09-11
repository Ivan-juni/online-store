import React from 'react';
import styles from './header.module.css';

const Header: React.FC = () => {
    return (
        <header className={styles.wrapper}>
            <h1 className={styles.caption}>Game store</h1>
            <div className={styles.basket}>
                <div className={styles.basket__thumb}>
                    <span className={styles.basket__quantity}>0</span>
                </div>
                <span className={styles.basket__sum}>
                    <span className={styles.sum__summary}>{`$summary`}</span>
                    uah
                </span>
            </div>
        </header>
    );
};

export default Header;