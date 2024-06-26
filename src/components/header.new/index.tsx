import {
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import "./index.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Popover, message } from "antd";
import IconFont from "../../utils/icon";
import { PNft } from "../../App";
import { FilterAddress, SupportID, calsAddress } from "../../utils";
import { Type } from "../../utils/types";
import { Config, NetworkConfig, flag } from "../../utils/source";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import MobileMenuDraw from "./components/mobile.menu";
import { useSwitchChain } from "../../hooks/chain";
import ConnectModal from "./components/connect.modal";
import { ProfileService } from "../../request/api";
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";
// import { useUnisat } from "../../utils/connect/unisat";
import Web3 from "web3";

export interface Menu {
  name: string;
  url: string;
  children?: Menu[];
}

export const MenuList: Menu[] = [
  // {
  //   name: "Inscriptions",
  //   url: "",
  //   children: [
  //     {
  //       name: "Inscribe",
  //       url: "/inscribe",
  //     },
  //     {
  //       name: "Collection",
  //       url: "/ins-collection",
  //     },
  //   ],
  // },
  {
    name: "Hot Memes",
    url: "/memes",
  },
  {
    name: "Swap",
    url: "/swap",
  },
  // {
  //   name: "NFTs",
  //   url: "",
  //   children: [
  //     {
  //       name: "Create",
  //       url: "/create",
  //     },
  //     {
  //       name: "Collections",
  //       url: "/collections",
  //     },
  //     {
  //       name: "Launchpad",
  //       url: "/launchpad",
  //     },
  //   ],
  // },
  // {
  //   name: 'Create',
  //   url: '/create',
  // },
  // {
  //   name: 'Collections',
  //   url: '/collections',
  // },

  // {
  //   name: "Memes",
  //   url: "",
  //   children: [
  //     {
  //       name: "Hot Memes",
  //       url: "/memes",
  //     },
  //     {
  //       name: "Hackathon",
  //       url: "/hacktahon",
  //     },
  //   ],
  // },
  // {
  //   name: "AI Campaigns",
  //   url: "/campaigns",
  // },
  // {
  //   name: "Airdrops",
  //   url: "/airdrop",
  //   children: [
  //     {
  //       name: "Daily Bonus",
  //       url: "/airdrop",
  //     },
  //     {
  //       name: "Invite",
  //       url: "/airdrop",
  //     },
  //     {
  //       name: "Rank",
  //       url: "/airdrop",
  //     },
  //     {
  //       name: "AIGC Campaigns",
  //       url: "/airdrop",
  //     },
  //   ],
  // },
  // {
  //   name: "FAQ",
  //   url: "https://forms.gle/LDzXJgQhQ3Ety4kT8",
  // },
];

const HeaderWapperNew = (): ReactElement<ReactNode> => {
  const navigate = useNavigate();
  // const { connectMetamask } = useMetamask();
  const { state, dispatch } = useContext(PNft);
  const [openPop, setOpen] = useState(false);
  const location = useLocation();
  const { switchC } = useSwitchChain();
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const [chainPop, setChainPop] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const { address, chainId } = useWeb3ModalAccount();
  // const { switchNetworkUnisat } = useUnisat();
  const { walletProvider } = useWeb3ModalProvider();
  const [levelPop, setLevelPop] = useState<boolean>(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen: boolean) => {
    if (flag) {
      setOpen(false);
      return;
    }
    setOpen(newOpen);
  };
  const userInfo = async (address: string) => {
    const account = await ProfileService({
      user_address: address,
    });
    dispatch({
      type: Type.SET_ADDRESS,
      payload: {
        address: address,
      },
    });
    dispatch({
      type: Type.SET_ACCOUNT,
      payload: {
        account: account.data,
      },
    });
  };
  const queryBalance = async (_address: string) => {
    const web3W = new Web3(walletProvider as any);
    const balance = await web3W.eth.getBalance(_address);
    dispatch({
      type: Type.SET_BALANCE,
      payload: {
        balance: String((+balance / 1e18).toFixed(4)),
      },
    });
  };
  useEffect(() => {
    // if (!address && state.is_connect === 1) {
    //     dispatch({
    //         type: Type.SET_ADDRESS,
    //         payload: {
    //             address: ''
    //         }
    //     })
    //     dispatch({
    //         type: Type.SET_IS_CONNECT,
    //         payload: {
    //             is_connect: 0
    //         }
    //     });
    //     dispatch({
    //         type: Type.SET_WALLET,
    //         payload: {
    //             wallet: ''
    //         }
    //     })
    // };
    if (address) {
      dispatch({
        type: Type.SET_IS_CONNECT,
        payload: {
          is_connect: 1,
        },
      });
      dispatch({
        type: Type.SET_WALLET,
        payload: {
          wallet: "walletconnect",
        },
      });
      dispatch({
        type: Type.SET_EVM,
        payload: {
          evm: "0",
        },
      });
      userInfo(address as string);
      queryBalance(address);
    }
    if (!address && state.is_connect === 1) {
      dispatch({
        type: Type.SET_ADDRESS,
        payload: {
          address: "",
        },
      });
      dispatch({
        type: Type.SET_IS_CONNECT,
        payload: {
          is_connect: 0,
        },
      });
      dispatch({
        type: Type.SET_WALLET,
        payload: {
          wallet: "",
        },
      });
    }
  }, [address]);
  useEffect(() => {
    switch (location.pathname) {
      // case "/inscribe":
      //   setActive(0);
      //   break;
      // case "/ins-collection":
      //   message.warning("Coming Soon");
      //   setActive(0);
      //   break;
      case "/memes":
        setActive(0);
        break;
      case "/swap":
        setActive(1);
        break;
      // case "/create":
      //   setActive(1);
      //   break;
      // case "/collections":
      //   setActive(1);
      //   break;
      // case "/launchpad":
      //   setActive(1);
      //   break;
      // case "/hackathon":
      //   setActive(2);
      //   break;
      // case "/airdrop":
      //   setActive(2);
      //   break;
      default:
        setActive(99);
    }
  }, [location.pathname]);
  useEffect(() => {
    if (!chainId) return;
    if (!address) return;
    dispatch({
      type: Type.SET_CHAIN,
      payload: {
        chain: String(chainId),
      },
    });
    queryBalance(address);
  }, [chainId]);
  const [active, setActive] = useState<number>(99);
  const { open } = useWeb3Modal();
  const content = (
    <div className="connect-menu" onClick={hide}>
      <ul>
        <li
          onClick={() => {
            // dispatch({
            //     type: Type.SET_OWNER_ADDRESS,
            //     payload: {
            //         owner_address: state.address as string
            //     }
            // })
            // navigate('/owner');
            navigate(`/user/${state.address}`);
          }}
        >
          <img src={require("../../assets/images/user.icon.png")} alt="" />
          Profile
        </li>
        <li
          onClick={() => {
            navigate("/profile");
          }}
        >
          <img src={require("../../assets/images/setting.icon.png")} alt="" />
          Setting
        </li>
        <li
          onClick={() => {
            const disconnect = () => {
              dispatch({
                type: Type.SET_ADDRESS,
                payload: {
                  address: "",
                },
              });
              dispatch({
                type: Type.SET_WALLET,
                payload: {
                  wallet: "",
                },
              });
              dispatch({
                type: Type.SET_EVM,
                payload: {
                  evm: "0",
                },
              });
              dispatch({
                type: Type.SET_CHAIN,
                payload: {
                  chain: "8007736",
                },
              });
              navigate("/");
            };
            // disconnect();
            state.is_connect === 1 ? open({ view: "Account" }) : disconnect();
          }}
        >
          <img
            src={require("../../assets/images/disconnect.icon.png")}
            alt=""
          />
          Disconnect
        </li>
      </ul>
    </div>
  );
  const chainContent = (
    <div
      className="connect-menu connect-menu-chain"
      onClick={() => {
        setChainPop(false);
      }}
    >
      <ul>
        {NetworkConfig.map((item: Config, index: number) => {
          return (
            <li
              key={index}
              onClick={() => {
                switchC(+item.chain_id);
              }}
            >
              <img src={item.chain_logo} alt="" />
              {item.chain_name}
            </li>
          );
        })}
      </ul>
    </div>
  );
  const ContentLevelMenu = (props: { item: Menu }) => {
    return (
      <ul>
        {props.item.children!.map((item: Menu, index: number) => {
          return (
            <li
              key={index}
              onClick={() => {
                if (item.url === "/create" && state.evm === "1") {
                  message.warning("This network is not supported yet");
                  return;
                }
                if (item.url === "/ins-collection") {
                  message.warning("Coming Soon");
                  return;
                }
                if (item.url === "/create") {
                  dispatch({
                    type: Type.SET_CREATE,
                    payload: {
                      create: "0",
                    },
                  });
                }
                if (item.url === "/airdrop") {
                  dispatch({
                    type: Type.SET_AIRDROP_TYPE,
                    payload: {
                      airdrop_type:
                        (item.name === "Daily Bonus" && "0") ||
                        (item.name === "Invite" && "1") ||
                        (item.name === "Rank" && "2") ||
                        (item.name === "AIGC Campaigns" && "3") ||
                        "0",
                    },
                  });
                }
                navigate(item.url);
                // setLevelPop(false);
              }}
            >
              <p>
                {item.name}
                {item.url === "/memes" && (
                  <img
                    src={require("../../assets/images/fire.gif")}
                    alt=""
                    className="need-t"
                  />
                )}
                {item.url === "/create" && (
                  <img
                    src={require("../../assets/images/ai.gif")}
                    alt=""
                    className="ai-i"
                  />
                )}
              </p>
            </li>
          );
        })}
      </ul>
    );
  };
  // const chainBTC = (
  //   <div className="connect-menu connect-menu-chain" onClick={() => {
  //     setChainPop(false)
  //   }}>
  //     <ul>
  //       {
  //         ['livenet', 'testnet'].map((item: string, index: number) => {
  //           return (
  //             <li key={index} onClick={() => {
  //               switchNetworkUnisat(item)
  //             }}>
  //               {item}
  //             </li>
  //           )
  //         })
  //       }
  //     </ul>
  //   </div>
  // )
  const handleLevel = (newOpen: boolean) => {
    setLevelPop(newOpen);
  };
  return (
    <div className="header-wapper-new">
      <div
        className="mobile-btn"
        onClick={() => {
          setMobileMenu(true);
        }}
      >
        <IconFont type="icon-a-Maskgroup" />
      </div>
      <img
        src={require("../../assets/images/logo.new.png")}
        alt=""
        className="left-logo"
        onClick={() => {
          navigate("/");
        }}
      />
      <ul className="menu-list">
        {MenuList.map((item: Menu, index: number) => {
          return (
            <li
              className={`${index === active ? "active-menu" : ""}`}
              key={index}
              onClick={() => {
                if (item.name === "FAQ") {
                  window.open(item.url);
                  return;
                }
                if (item.children) return;
                setActive(index);
                navigate(item.url);
              }}
            >
              {!item.children ? (
                <p>{item.name}</p>
              ) : (
                //TODO  open={levelPop} onOpenChange={handleLevel}
                <Popover
                  placement="bottom"
                  rootClassName="custom-level-menu"
                  title={null}
                  content={<ContentLevelMenu item={item} />}
                >
                  <p className="with-arrow">
                    {item.name}
                    <DownOutlined />
                  </p>
                </Popover>
              )}

              {item.url === "/memes" && (
                <img src={require("../../assets/images/fire.gif")} alt="" />
              )}
              {/* {item.url === '/create' && <img src={require('../../assets/images/ai.gif')} alt="" className="ai-i" />} */}
            </li>
          );
        })}
      </ul>
      <div className="right-menu">
        {state.wallet && state.evm === "0" && (
          <Popover
            open={chainPop}
            onOpenChange={(e: boolean) => {
              if (flag) {
                return;
              }
              setChainPop(e);
            }}
            content={chainContent}
            title={null}
            trigger="click"
          >
            <div
              className="connect-box select-chain"
              style={{ padding: "0 24px" }}
            >
              <div className="connected-box">
                {SupportID.indexOf(+(state.chain as string)) < 0 ? (
                  "Not supported "
                ) : (
                  <img
                    src={FilterAddress(state.chain as string)?.chain_logo}
                    alt=""
                  />
                )}
                {/* <IconFont type="icon-xiangxia" /> */}
                <DownOutlined />
              </div>
            </div>
          </Popover>
        )}
        {/* BTC Select Network */}
        {state.wallet && state.wallet === "btc" && (
          <div className="connect-box select-chain connect-without-icon">
            <div className="connected-box">
              <img
                src={require("../../assets/images/bitcoin.logo.png")}
                alt=""
              />
              <p>Bitcoin</p>
            </div>
          </div>
        )}
        {state.wallet && state.wallet === "sol" && (
          <div className="connect-box select-chain connect-without-icon">
            <div className="connected-box">
              <img
                src={require("../../assets/images/solana.logo.png")}
                alt=""
              />
              <p>Solana</p>
            </div>
          </div>
        )}
        <div className={`connect-box ${state.address ? "connected-box" : ""}`}>
          {!state.address ? (
            <Button
              type="default"
              onClick={() => {
                // connectMetamask();
                setVisible(true);
              }}
            >
              <IconFont type="icon-a-qianbao11" />
              {flag ? "" : "Connect Wallet"}
            </Button>
          ) : (
            <Popover
              open={openPop}
              onOpenChange={handleOpenChange}
              content={content}
              title={null}
              trigger="click"
            >
              <div className="connected-box-i">
                <img src={state.account.avatar_url} alt="" />
                <p>{calsAddress(state.address)}</p>
                <div className="arrow-box">
                  <DownOutlined />
                  {/* <IconFont type="icon-xiangxia" /> */}
                </div>
              </div>
            </Popover>
          )}
        </div>
        <div className="mobile-menu">
          <MenuOutlined
            onClick={() => {
              setMobileMenu(true);
            }}
          />
          <MobileMenuDraw
            visible={mobileMenu}
            closeDraw={(val: boolean) => {
              setMobileMenu(val);
            }}
          />
        </div>
        <ConnectModal
          visible={visible}
          close={(val: boolean) => {
            setVisible(val);
          }}
        />
      </div>
    </div>
  );
};

export default HeaderWapperNew;
