import { Context, IAction, State, Type, ethereum } from "../utils/types";
import { web3 } from "../utils/types";

export const defaultState: State = {
  ethereum: window?.ethereum,
  web3: web3, //Global web3 object
  chain: sessionStorage.getItem("chain") || "8453",
  address: sessionStorage.getItem("address") || null, //Current connection address
  screen_index: Number(sessionStorage.getItem("screen_index")) || 0,
  card: JSON.parse(sessionStorage.getItem("card") || "{}"),
  account: JSON.parse(sessionStorage.getItem("account") || "{}"),
  avatar: sessionStorage.getItem("avatar") || "",
  swiper_ref: null,
  owner_address: sessionStorage.getItem("owner_address") || "",
  info_id: sessionStorage.getItem("info_id") || "",
  collection_id: sessionStorage.getItem("collection_id") || "",
  contest_id: sessionStorage.getItem("contest_id") || "",
  erc20_address: sessionStorage.getItem("erc20_address") || "",
  screen_one: sessionStorage.getItem("screen_one") || "",
  screen_two: sessionStorage.getItem("screen_two") || "",
  coll_one: sessionStorage.getItem("coll_one") || "",
  coll_two: sessionStorage.getItem("coll_two") || "",
  coll_three: sessionStorage.getItem("coll_three") || "",
  gallery_one: sessionStorage.getItem("gallery_one") || "",
  gallery_two: sessionStorage.getItem("gallery_two") || "",
  gallery_three: sessionStorage.getItem("gallery_three") || "",
  campage_list: sessionStorage.getItem("campage_list") || "",
  connect_modal: false,
  is_connect: Number(sessionStorage.getItem("is_connect") as string) || 0,
  wallet: sessionStorage.getItem("wallet") || "",
  balance: sessionStorage.getItem("balance") || "0",
  create: "0",
  evm: sessionStorage.getItem("evm") || "0", //!! 0 - EVM   1 - Other
  launchpad: sessionStorage.getItem("launchpad") || "",
  memes: sessionStorage.getItem("memes") || "",
  airdrop_type: sessionStorage.getItem("airdrop_type") || "0",
  hackathon: sessionStorage.getItem("hackathon") || "",
};

export const defaultContext: Context = {
  state: defaultState,
  dispatch: (_: IAction) => {},
};

export const defaultStateInit = (defaultState: State) => {
  return defaultState;
};

export const initState = (state: State, action: IAction) => {
  const { type, payload } = action;
  switch (type) {
    case Type.SET_ETHEREUM:
      return { ...state, ethereum: payload.ethereum };
    case Type.SET_WEB3:
      return { ...state, web3: payload.web3 };
    case Type.SET_ADDRESS:
      sessionStorage.setItem("address", payload.address as string);
      return { ...state, address: payload.address };
    case Type.SET_SCREEN_INDEX:
      sessionStorage.setItem("screen_index", String(payload.screen_index));
      return { ...state, screen_index: payload.screen_index };
    case Type.SET_CARD:
      sessionStorage.setItem("card", JSON.stringify(payload.card));
      return { ...state, card: payload.card };
    case Type.SET_ACCOUNT:
      sessionStorage.setItem("account", JSON.stringify(payload.account));
      return { ...state, account: payload.account };
    case Type.SET_AVATAR:
      sessionStorage.setItem("avatar", payload.avatar as string);
      return { ...state, avatar: payload.avatar };
    case Type.SET_SWIPER:
      return { ...state, swiper_ref: payload.swiper_ref };
    case Type.SET_OWNER_ADDRESS:
      sessionStorage.setItem("owner_address", payload.owner_address as string);
      return { ...state, owner_address: payload.owner_address };
    case Type.SET_INFO_ID:
      sessionStorage.setItem("info_id", payload.info_id as string);
      return { ...state, info_id: payload.info_id };
    case Type.SET_COLLECTION_ID:
      sessionStorage.setItem("collection_id", payload.collection_id as string);
      return { ...state, collection_id: payload.collection_id };
    case Type.SET_CONTEST_ID:
      sessionStorage.setItem("contest_id", payload.contest_id as string);
      return { ...state, contest_id: payload.contest_id };
    case Type.SET_CHAIN:
      sessionStorage.setItem("chain", payload.chain as string);
      return { ...state, chain: payload.chain };
    case Type.SET_ERC20_ADDRESS:
      sessionStorage.setItem("erc20_address", payload.erc20_address as string);
      return { ...state, erc20_address: payload.erc20_address };
    case Type.SET_SCREEN_ONE:
      sessionStorage.setItem("screen_one", JSON.stringify(payload.screen_one));
      return { ...state, screen_one: JSON.stringify(payload.screen_one) };
    case Type.SET_SCREEN_TWO:
      sessionStorage.setItem("screen_two", JSON.stringify(payload.screen_two));
      return { ...state, screen_two: JSON.stringify(payload.screen_two) };
    case Type.SET_COLL_ONE:
      sessionStorage.setItem("coll_one", JSON.stringify(payload.coll_one));
      return { ...state, coll_one: JSON.stringify(payload.coll_one) };
    case Type.SET_COLL_TWO:
      sessionStorage.setItem("coll_two", JSON.stringify(payload.coll_two));
      return { ...state, coll_two: JSON.stringify(payload.coll_two) };
    case Type.SET_COLL_THREE:
      sessionStorage.setItem("coll_three", JSON.stringify(payload.coll_three));
      return { ...state, coll_three: JSON.stringify(payload.coll_three) };
    case Type.SET_GALLERY_ONE:
      sessionStorage.setItem(
        "gallery_one",
        JSON.stringify(payload.gallery_one)
      );
      return { ...state, gallery_one: JSON.stringify(payload.gallery_one) };
    case Type.SET_GALLERY_TWO:
      sessionStorage.setItem(
        "gallery_two",
        JSON.stringify(payload.gallery_two)
      );
      return { ...state, gallery_two: JSON.stringify(payload.gallery_two) };
    case Type.SET_GALLERY_THREE:
      sessionStorage.setItem(
        "gallery_three",
        JSON.stringify(payload.gallery_three)
      );
      return { ...state, gallery_three: JSON.stringify(payload.gallery_three) };
    case Type.SET_CAMPAGE_LIST:
      sessionStorage.setItem(
        "campage_list",
        JSON.stringify(payload.campage_list)
      );
      return { ...state, campage_list: JSON.stringify(payload.campage_list) };
    case Type.SET_CONNECT_MODAL:
      return { ...state, connect_modal: payload.connect_modal };
    case Type.SET_IS_CONNECT:
      sessionStorage.setItem("is_connect", String(payload.is_connect));
      return { ...state, is_connect: payload.is_connect };
    case Type.SET_WALLET:
      sessionStorage.setItem("wallet", payload.wallet as string);
      return { ...state, wallet: payload.wallet };
    case Type.SET_BALANCE:
      sessionStorage.setItem("balance", payload.balance as string);
      return { ...state, balance: payload.balance };
    case Type.SET_CREATE:
      return { ...state, create: payload.create };
    case Type.SET_EVM:
      sessionStorage.setItem("evm", payload.evm as string);
      return { ...state, evm: payload.evm };
    case Type.SET_LAUNCHPAD:
      sessionStorage.setItem("launchpad", JSON.stringify(payload.launchpad));
      return { ...state, launchpad: JSON.stringify(payload.launchpad) };
    case Type.SET_MEMES:
      sessionStorage.setItem("memes", JSON.stringify(payload.memes));
      return { ...state, memes: JSON.stringify(payload.memes) };
    case Type.SET_AIRDROP_TYPE:
      sessionStorage.setItem("airdrop_type", payload.airdrop_type as string);
      return { ...state, airdrop_type: payload.airdrop_type };
    case Type.SET_HACKATHON:
      sessionStorage.setItem("hackathon", payload.hackathon ? JSON.stringify(payload.hackathon) : '');
      return { ...state, hackathon: payload.hackathon ? JSON.stringify(payload.hackathon) : ''};
    default:
      return state;
  }
};
