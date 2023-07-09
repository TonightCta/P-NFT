import { Context, IAction, State, Type } from "../utils/types";
import { web3 } from "../utils/types";

export const defaultState: State = {
    web3: web3,//Global web3 object
    address: sessionStorage.getItem('address') || null,//Current connection address
    screen_index: Number(sessionStorage.getItem('screen_index')) || 0,
    card: JSON.parse(sessionStorage.getItem('card') || '{}'),
    account: JSON.parse(sessionStorage.getItem('account') || '{}'),
    avatar: sessionStorage.getItem('avatar') || ''
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
        default:
            return state;
    }
};
