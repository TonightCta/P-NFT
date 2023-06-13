import { Context, IAction, State, Type } from "../utils/types";
import { web3 } from "../utils/types";

export const defaultState: State = {
    web3: web3,//Global web3 object
    address: sessionStorage.getItem('address') || null,//Current connection address
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
        default:
            return state;
    }
};
