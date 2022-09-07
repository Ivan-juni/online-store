import React from 'react';
import game_image from '../../assets/images/forza.png';
import styles from './game.module.css';

const Game = () => {
    return (
        <div className={styles.game}>
            <img className={styles.game__thumb} src={game_image} alt="forza" />
            <div className={styles.game__panel}>
                <h3 className={styles.panel__caption}>Forza Horizon 4</h3>
                <div className={styles.panel__janres}>
                    <div className={styles.panel__janre}><h4>Racing</h4></div>
                    <div className={styles.panel__janre}><h4>Simulator</h4></div>
                    <div className={styles.panel__janre}><h4>Open world</h4></div>
                </div>
                <div className={styles.panel__cart}>
                    <div className={styles.cart__add}>
                        <button className={styles.btn_add}>Add to cart</button>
                    </div>
                    <div>
                        <span className={styles.price}>3200</span>uah
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game;