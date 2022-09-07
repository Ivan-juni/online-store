import React from 'react';
import styles from './cartGame.module.css';
import remove_icon from '../../../assets/images/remove-icon.svg';

const CartGame: React.FC = () => {
    return (
                    <tr className={styles.cart__game}>
                        <td className={styles.game__caption}>
                            <h3>Forza Horizon 4</h3>
                        </td>
                        <td className={styles.game__price}>
                            <h3>3200 uah</h3>
                        </td>
                        <td>
                            <button className={styles.cart__btn_remove}>
                                <img src={remove_icon} alt="rem" />
                            </button>
                        </td>
                    </tr>
    );
};

export default CartGame;