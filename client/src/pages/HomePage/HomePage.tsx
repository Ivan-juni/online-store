import React, { useState } from 'react';
import Cart from '../../components/Cart/Cart';
import Game from '../../components/Game/Game';
import styles from './homePage.module.css';

const HomePage: React.FC = () => {
    // template || test
    const [isCartActive, setCartActive] = useState(false);

    return (
        <div className={styles.wrapper}>
            { isCartActive && <div className={styles.cart}><Cart /></div>}   
            <button onClick={() => setCartActive(prev => !prev)}>Test</button>
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