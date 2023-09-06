import { Context, IAction, State, Type } from "../utils/types";
import { web3 } from "../utils/types";

export const defaultState: State = {
    web3: web3,//Global web3 object
    address: sessionStorage.getItem('address') || null,//Current connection address
    screen_index: Number(sessionStorage.getItem('screen_index')) || 0,
    card: JSON.parse(sessionStorage.getItem('card') || '{}'),
    account: JSON.parse(sessionStorage.getItem('account') || '{}'),
    avatar: sessionStorage.getItem('avatar') || '',
    swiper_ref: null,
    owner_address: sessionStorage.getItem('owner_address') || '',
    info_id:sessionStorage.getItem('info_id') || '',
    collection_id:sessionStorage.getItem('collection_id') || ''
};

export const defaultContext: Context = {
    state: defaultState,
    dispatch: (_: IAction) => { }
}

export const defaultStateInit = (defaultState: State) => {
    return defaultState
}

export const initState = (state: State, action: IAction) => {
    const { type, payload } = action;
    switch (type) {
        case Type.SET_ADDRESS:
            sessionStorage.setItem('address', payload.address as string);
            return { ...state, address: payload.address }
        case Type.SET_SCREEN_INDEX:
            sessionStorage.setItem('screen_index', String(payload.screen_index));
            return { ...state, screen_index: payload.screen_index }
        case Type.SET_CARD:
            sessionStorage.setItem('card', JSON.stringify(payload.card));
            return { ...state, card: payload.card }
        case Type.SET_ACCOUNT:
            sessionStorage.setItem('account', JSON.stringify(payload.account));
            return { ...state, account: payload.account }
        case Type.SET_AVATAR:
            sessionStorage.setItem('avatar', payload.avatar as string);
            return { ...state, avatar: payload.avatar }
        case Type.SET_SWIPER:
            return { ...state, swiper_ref: payload.swiper_ref };
        case Type.SET_OWNER_ADDRESS:
            sessionStorage.setItem('owner_address', payload.owner_address as string);
            return { ...state, owner_address: payload.owner_address }
        case Type.SET_INFO_ID:
            sessionStorage.setItem('info_id', payload.info_id as string);
            return { ...state, info_id: payload.info_id }
        case Type.SET_COLLECTION_ID:
            sessionStorage.setItem('collection_id', payload.collection_id as string);
            return { ...state, collection_id: payload.collection_id }
        default:
            return state;
    }
};
