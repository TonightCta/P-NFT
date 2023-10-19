import Web3 from 'web3'
import currentProvider from 'web3'


const win: any = window;
export const { ethereum } = win;

export const web3 = new Web3(ethereum || currentProvider);
export const web3P =new Web3(new Web3.providers.HttpProvider('https://mainnet.plian.io/child_0'));

export interface State {
    web3?: any,
    address?: string | null,
    screen_index?: number,
    card?: any,
    account?: any,
    avatar?: string,
    swiper_ref?: any,
    owner_address?: string,
    info_id?: string,
    collection_id?: string,
    contest_id?: string,
    chain?: string,
    erc20_address?:string,
}

export interface IResponse {
    code: number,
    status: number,
    data: any,
    message: string,
    msg: string
}

export enum Type {
    SET_CHAIN = 'set_chain',
    SET_ADDRESS = 'set_address',
    SET_SCREEN_INDEX = 'set_screen_index',
    SET_CARD = 'set_card',
    SET_ACCOUNT = 'set_account',
    SET_AVATAR = 'set_avatar',
    SET_SWIPER = 'set_swiper',
    SET_OWNER_ADDRESS = 'set_owner_address',
    SET_INFO_ID = 'set_info_id',
    SET_COLLECTION_ID = 'set_collection_id',
    SET_CONTEST_ID = 'set_contest_id',
    SET_ERC20_ADDRESS = 'erc20_address'
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
    file_voice_ipfs: string,
    file_voice_minio_url: string,
    file_image_minio_url: string,
    price?: string,
    paymod?: string,
    token_id: number,
    file_name: string,
    load: boolean,
    off?: boolean,
    order_id: string,
    play: boolean,
    seller: string,
    fid: number,
    seller_avatar_url: string,
    pay_currency_name: string,
    image_minio_url: string,
    for_sale: boolean,
    for_unsale: boolean,
    for_competetion: boolean,
    chain_id: string,
    collection_name: string
}