import React from 'react';
import Game from '../../components/Game/Game';
import styles from './homePage.module.css';
import Cart from '../../components/Cart/Cart';

const HomePage: React.FC = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.games}>
                <Game />
                <Game />
                <Game />
                <Game />
                <Game />
            </div>
        </div>
    );
};

export default HomePage;