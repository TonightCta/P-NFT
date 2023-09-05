import Web3 from 'web3'
import currentProvider from 'web3'


const win: any = window;
export const { ethereum } = win;

export const web3 = new Web3(ethereum || currentProvider);

export interface State {
    web3?: any,
    address?: string | null,
    screen_index?: number,
    card?: any,
    account?:any,
    avatar?:string,
    swiper_ref?:any,
    owner_address?:string
}

export interface IResponse {
    code: number,
    status: number,
    data: any,
    message: string,
    msg:string
}

export enum Type {
    SET_ADDRESS = 'set_address',
    SET_SCREEN_INDEX = 'set_screen_index',
    SET_CARD = 'set_card',
    SET_ACCOUNT = 'set_account',
    SET_AVATAR = 'set_avatar',
    SET_SWIPER = 'set_swiper',
    SET_OWNER_ADDRESS = 'set_owner_address'
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

export interface NFTItem {
    file_image_ipfs: string,
    file_voice_ipfs:string,
    file_image_minio_url:string,
    price?: string,
    paymod?: string,
    token_id: number,
    file_name: string,
    load: boolean,
    off?: boolean,
    order_id:string,
    play:boolean,
    seller:string
}