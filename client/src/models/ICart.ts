import { IGame } from "./IGame";

export interface ICart {
    id: string;
    userId: string;
    itemsInCart: IGame[]
}