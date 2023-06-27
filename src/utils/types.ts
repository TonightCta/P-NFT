import Web3 from 'web3'
import currentProvider from 'web3'


const win: any = window;
export const { ethereum } = win;

export const web3 = new Web3(ethereum || currentProvider);

export interface State {
    web3?: any,
    address?: string | null,
    screen_index?:number
}

export enum Type {
    SET_ADDRESS = 'set_address',
    SET_SCREEN_INDEX = 'set_screen_index'
};

export interface IAction {
    type: string,
    payload: State
}

export interface Context {
    state: State,
    dispatch: (action: IAction) => void
}

export interface IResponse {
    code: number,
    data: any,
    message: string
}