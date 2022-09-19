import React from 'react';
import styles from './cart.module.css';
import CartGame from './CartGame/CartGame';

const Cart: React.FC = () => {
    return (
        <>
         <div className={styles.wrapper}>
            <table className={styles.cart}>
                <tr>
                    <th className={styles.cart__caption}>
                        <h3>Caption</h3>
                    </th>
                    <th className={styles.cart__price}>
                        <h3>Price</h3>
                    </th>
                </tr>
                <CartGame />
                <CartGame />
                <CartGame />
            </table>
            <hr className={styles.h_line}/>
            <table className={styles.cart__sum}>
                <tr>
                    <td>
                        Sum:
                    </td>
                    <td>
                        <span className={styles.cart__summary}>{"$summary"}</span>
                        uah
                    </td>
                </tr>
            </table>
        </div>
        </>
    );
};

export default Cart;