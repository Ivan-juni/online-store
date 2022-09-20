import React from 'react';
import styles from './game.module.css';
import game_image from '../../assets/images/forza.png';
import info_icon from '../../assets/images/info-icon.svg';
import { addItemInCart } from '../../store/reducers/CartSlice';
import { useAppDispatch } from '../../hooks/redux';
import { IGame } from '../../models/IGame';

type PropsType = {
    game: IGame
}

const Game: React.FC<PropsType> = ({ game }) => {
    // const game = {
    //     id: '1412',
    //     name: 'Forza',
    //     price: 1200,
    //     categoryName: ['Racing', 'Open World'],
    //     isAvailable: true,
    //     image: game_image,
    //     gameInfo: {
    //         title: "FORZA HORIZON 4",
    //         description: "lorem10gdsdgldsgfdhdhdfhdf"
    //     }
    // }

    const dispatch = useAppDispatch();
    const handleClick = (e: any) => {
        e.stopPropagation();
        // * id будет браться после маппинга в HomePage, из пропсов game.id
        dispatch(addItemInCart(game.id)); // !дописать санку после готовности апи
    }

    return (
        <div className={styles.game}>
            <div className={styles.game__image}>
                <img className={styles.game__thumb} src={game_image} alt="forza" />
                <div className={styles.info}><img src={info_icon} alt="i" /></div>
            </div>
            <hr className={styles.v_line}/>
            <div className={styles.game__panel}>
                <h3 className={styles.panel__caption}>Forza Horizon 4</h3>
                <div className={styles.panel__janres}>
                    <div className={styles.panel__janre}><h4>Racing</h4></div>
                    <div className={styles.panel__janre}><h4>Simulator</h4></div>
                    <div className={styles.panel__janre}><h4>Open world</h4></div>
                </div>
                <div className={styles.panel__cart}>
                    <div className={styles.cart__add}>
                        <button className={styles.btn_add}
                                onClick={handleClick}
                        >Add to cart</button>
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