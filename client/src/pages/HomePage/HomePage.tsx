import React from 'react';
import Cart from '../../components/Cart/Cart';
import Game from '../../components/Game/Game';
import { useAppSelector } from '../../hooks/redux';
import styles from './homePage.module.css';

type PropsType = {
    isCartActive: boolean
};

const HomePage: React.FC<PropsType> = ({isCartActive}) => {
    const games = useAppSelector((state) => state.games) //  !написать games reducer
    
    return (
        <div className={styles.wrapper}>
            { isCartActive && <div className={styles.cart}><Cart /></div>}   
            <div className={styles.games}>
                {games.map((g) => (
                    <Game game={g} key={g.id} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;