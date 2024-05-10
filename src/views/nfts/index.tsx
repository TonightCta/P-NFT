import {
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import "./index.scss";
import { Pagination, Spin, Popover, message, Drawer } from "antd";
import { MFTOffService, WalletNFT, CurrencyInfo } from "../../request/api";
import { NFTItem } from "../../utils/types";
import OwnerCard from "./components/owner.card";
import { useParams } from "react-router-dom";
import MaskCard from "../../components/mask";
import { PNft } from "../../App";
import { VERSION } from "../../utils/source";
import NewNFTCard from "./components/new.card";
import { AlignRightOutlined, DownOutlined } from "@ant-design/icons";
import FixedModal from "../detail/components/fixed.price";
import { useContract } from "../../utils/contract";
import { useSwitchChain } from "../../hooks/chain";
import { FilterAddress, FilterChainsToken } from "../../utils";
import IconFont from "../../utils/icon";
import TokensList from "./components/tokens.list";
// import FooterNew from "../screen.new/components/footer.new";
import { SystemAddress } from "./../../utils/source";

interface OP {
  label: string;
  value: string;
  icon: string;
}

interface Sale {
  token_name: string;
  collection_name: string;
  chain_id: string;
  image_url: string;
  token_id: number;
  nft_address: string;
}

const options: OP[] = [
  {
    label: "All Chains",
    value: "999",
    icon: "",
  },
  {
    label: "Ethereum",
    value: "1",
    icon: require("../../assets/images/eth.logo.png"),
  },
  {
    label: "Plian",
    value: "8007736",
    icon: require("../../assets/images/plian.logo.png"),
  },
  {
    label: "Optimism",
    value: "10",
    icon: require("../../assets/images/op.logo.png"),
  },
  {
    label: "Filecoin",
    value: "314",
    icon: require("../../assets/images/fil.logo.png"),
  },
  {
    label: "PlatON",
    value: "210425",
    icon: require("../../assets/images/plat.logo.png"),
  },
  {
    label: "Bitcoin",
    value: "btcmain",
    icon: require("../../assets/images/bitcoin.logo.png"),
  },
  {
    label: "Solana",
    value: "solmain",
    icon: require("../../assets/images/solana.logo.png"),
  },
];

const OwnerNFTSView = (): ReactElement<ReactNode> => {
  const [activeTop, setActiveTop] = useState<number>(0);
  const [list, setList] = useState<NFTItem[]>([]);
  const searchParams = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [itemList, setItemList] = useState<NFTItem[]>([]);
  const { takeOff } = useContract();
  const { state } = useContext(PNft);
  const [otherBg, setOtherBG] = useState<string>("1");
  const [loadingBg, setLoadingBg] = useState<boolean>(true);
  const { switchC } = useSwitchChain();
  const [open, setOpen] = useState(false);
  const [mobileFilter, setMobileFilter] = useState<boolean>(false);
  const [chainInfo, setChainInfo] = useState<OP>({
    label: "All chains",
    value: "999",
    icon: "",
  });
  const [balanceUSDT, setBalanceUSDT] = useState<string>("");
  const getBalanceByUSDT = async () => {
    const result = await CurrencyInfo({
      chain_id: state.chain,
      contract_address: SystemAddress,
    });
    const { data } = result;
    if (!data.price_usdt) {
      setBalanceUSDT("0.0000");
      return;
    }
    const usdt_balance = data.price_usdt * +state.balance!;
    setBalanceUSDT(usdt_balance.toFixed(4));
  };
  useEffect(() => {
    getBalanceByUSDT();
  }, []);
  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  //On Sle
  const saleListFN = async () => {
    setLoading(true);
    const result = await WalletNFT({
      chain_id: chainInfo.value === "999" ? "" : chainInfo.value,
      is_onsale: true,
      address: searchParams.address,
      page_size: 12,
      page_num: page,
    });
    setLoading(false);
    const { status, data } = result;
    if (status !== 200) {
      return;
    }
    setTotal(data.total);
    if (!data.item) {
      setList([]);
      return;
    }
    const filter = data.item.map((item: any) => {
      return (item = {
        ...item,
        load: true,
        off: true,
        is_start: false,
      });
    });
    setList(filter);
  };
  const loadMoreData = () => {
    activeTop === 0 ? saleListFN() : itemQuery();
  };
  const itemQuery = async () => {
    setLoading(true);
    const result: any = await WalletNFT({
      chain_id: chainInfo.value === "999" ? "" : chainInfo.value,
      address: searchParams.address,
      is_onsale: false,
      page_size: 18,
      page_num: page,
    });
    setLoading(false);
    const { data } = result;
    setTotal(data.total);
    if (!data.item) {
      setItemList([]);
      return;
    }
    const filter = data.item.map((item: any) => {
      return (item = {
        ...item,
        load: true,
        off: true,
        is_start: false,
      });
    });
    setItemList(filter);
    // const now: NFTItem[] = [];
    // result.forEach(async (e: any) => {
    //     const detail = await axios.get(e.tokenURI);
    //     const params = {
    //         ...e,
    //         file_image_ipfs: detail.data.image,
    //         file_voice_ipfs: detail.data.external_url,
    //         token_id: +e.id,
    //         file_name: detail.data.name,
    //         load: true,
    //         play: false
    //     };
    //     now.push(params);
    // });
    setLoading(false);
  };
  useEffect(() => {
    loadMoreData();
  }, [searchParams.address, page, chainInfo.value]);
  const selectTop = (_type: number) => {
    // switch (_type) {
    //     case 0:
    //         setChangeTabs(['Buy now', 'Ended'])
    //         break;
    //     case 1:
    //         setChangeTabs(['In Wallet', 'Favorites'])
    //         break;
    //     case 2:
    //         setChangeTabs(['Mine', 'Favorites'])
    //         break;
    //     default:
    //         setChangeTabs(['Buy now', 'Ended'])
    // };
    setActiveTop(_type);
    setList([]);
    setItemList([]);
    _type === 0 ? saleListFN() : itemQuery();
  };
  const calsBG = () => {
    const bol = searchParams.address === state.address;
    return bol ? state.account.bgimage_url : otherBg;
  };
  const [sale, setSale] = useState<Sale>({
    token_name: "",
    collection_name: "",
    chain_id: "8007736",
    image_url: "",
    token_id: 0,
    nft_address: "",
  });
  const [fixedVisible, setFixedVisible] = useState<boolean>(false);
  const content = (
    <div className="select-chains">
      <ul>
        {options.map((item: OP, index: number) => {
          return (
            <li
              key={index}
              onClick={() => {
                // if (item.label === 'Bitcoin') { return }
                setChainInfo(item);
                hide();
              }}
              className={``}
            >
              {item.icon && <img src={item.icon} alt="" />}
              <p>{item.label}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
  const [assetsType, setAssetsType] = useState<string>("NFTs");
  const [filter, setFilter] = useState<boolean>(false);
  return (
    <div className="owner-view">
      {VERSION === "old" && <MaskCard />}
      <div className="up-mask">
        <div className="owner-bg">
          <img
            className={`${calsBG() ? "" : "max-height"}`}
            src={
              calsBG() ? calsBG() : require("../../assets/images/test_bg.png")
            }
            onLoad={() => {
              setLoadingBg(false);
            }}
            alt=""
          />
          {loadingBg && (
            <div className="loading-bg">
              <Spin size="large" />
            </div>
          )}
        </div>
        <div className="owner-inner">
          <OwnerCard
            updateList={(val: number) => {
              selectTop(val);
            }}
            updateBG={(_url: string) => {
              setOtherBG(_url);
            }}
          />
          <div className="inner-data">
            <div className="filter-box">
              <div className="tabs">
                <ul>
                  {(searchParams.address === state.address
                    ? ["On Sale", "Wallet"]
                    : ["On sale"]
                  ).map((item: string, index: number): ReactElement => {
                    return (
                      <li
                        key={index}
                        className={`${activeTop === index ? "active-top" : ""}`}
                        onClick={() => {
                          selectTop(index);
                        }}
                      >
                        {item}
                      </li>
                    );
                  })}
                </ul>
                {searchParams.address === state.address && (
                  <div className="balance-box">
                    <p>
                      Balance:
                      <img
                        src={
                          state.evm === "1"
                            ? FilterChainsToken(state.wallet as string).logo
                            : FilterAddress(state.chain as string).chain_logo
                        }
                        alt=""
                      />
                      <span>{state.balance}</span>
                    </p>
                    <div className="balance-by-u">
                      Price&nbsp;($&nbsp;
                      {balanceUSDT ? balanceUSDT : <Spin size="small" />})
                    </div>
                  </div>
                )}
              </div>
              {/* <div className="search-box">
                                <input type="text" placeholder="Search" />
                            </div> */}
              <div className="other-filter">
                <Popover
                  placement="bottom"
                  className="select-chain-asset"
                  open={open}
                  onOpenChange={handleOpenChange}
                  trigger={["click"]}
                  title={null}
                  content={content}
                >
                  <div className="ss-i">
                    <div>
                      {chainInfo.icon && <img src={chainInfo.icon} alt="" />}
                      <p>{chainInfo.label}</p>
                    </div>
                    <DownOutlined />
                  </div>
                </Popover>
                {activeTop === 1 && (
                  <div
                    className="mobile-filter-btn"
                    onClick={() => {
                      setMobileFilter(true);
                    }}
                  >
                    <AlignRightOutlined />
                  </div>
                )}
              </div>
            </div>
            <div
              className={`conponenst-gater ${loading ? "gater-6n" : ""}`}
              id="ownerView"
            >
              <div className={`list-item ${!filter ? "filter-condition" : ""}`}>
                {activeTop === 1 && (
                  <div
                    className={`wallet-assets-filter ${
                      filter ? "close-condition" : ""
                    }`}
                  >
                    <div
                      className="control-filter"
                      onClick={() => {
                        setFilter(!filter);
                      }}
                    >
                      <IconFont
                        type="icon-a-lujing219"
                        className={`${!filter ? "close-filter" : ""}`}
                      />
                    </div>
                    <div className="condition-list">
                      <ul>
                        {["All", "Tokens", "NFTs", "Inscriptions"].map(
                          (item: string, index: number) => {
                            return (
                              <li
                                key={index}
                                className={`${
                                  item === "NFTs" || item === "Tokens"
                                    ? ""
                                    : "dis-c"
                                } ${
                                  assetsType === item ? "active-condition" : ""
                                }`}
                                onClick={() => {
                                  if (item !== "NFTs" && item !== "Tokens")
                                    return;
                                  setAssetsType(item);
                                }}
                              >
                                <p>{item}</p>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>
                  </div>
                )}
                {assetsType === "NFTs" ? (
                  <div className="item-inner-list">
                    {loading && (
                      <div className="load-data-box">
                        <Spin size="large" />
                      </div>
                    )}
                    {(activeTop === 0 ? list : itemList).map(
                      (item: NFTItem, index: number) => {
                        // [1,2,3,4,5,6,7,8].map((item: any, index: number) => {
                        return (
                          <NewNFTCard
                            type={activeTop === 0 ? 1 : 2}
                            key={index}
                            item={item}
                            uploadTakeoff={async () => {
                              const switc: any = await switchC(+item.chain_id);
                              if (switc.code) return;
                              const hash: any = await takeOff(+item.order_id);
                              if (!hash || hash.message) {
                                return;
                              }
                              const maker = await MFTOffService({
                                chain_id: item.chain_id,
                                sender: state.address,
                                tx_hash: hash["transactionHash"],
                              });
                              const { status } = maker;
                              if (status !== 200) {
                                message.error(maker.message);
                                return;
                              }
                              message.success(
                                "Take off the shelves Successfully!"
                              );
                              setList([]);
                              setPage(1);
                              setLoading(true);
                              saleListFN();
                            }}
                            uploadSaleInfo={() => {
                              setSale({
                                collection_name: item.collection_name,
                                token_id: item.token_id,
                                token_name: item.token_name,
                                chain_id: item.chain_id,
                                image_url: item.image_url,
                                nft_address: item.contract_address,
                              });
                              setFixedVisible(true);
                            }}
                          />
                        );
                      }
                    )}
                  </div>
                ) : (
                  <TokensList chain_id={chainInfo.value} />
                )}
              </div>
            </div>
            {total === 0 && !loading && assetsType !== "Tokens" && (
              <p className="no-more">No more</p>
            )}
            <div className="page-oper">
              <Pagination
                hideOnSinglePage
                defaultCurrent={1}
                pageSize={12}
                total={total}
                onChange={(page) => {
                  window.scrollTo({
                    top: 220,
                    behavior: "smooth",
                  });
                  setPage(page);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <FixedModal
        name={sale.token_name}
        nft_address={sale.nft_address}
        collection={sale.collection_name}
        chain={sale.chain_id}
        upRefresh={() => {
          setItemList([]);
          setLoading(true);
          itemQuery();
        }}
        sell
        visible={fixedVisible}
        image={sale.image_url}
        id={sale.token_id}
        closeModal={(val: boolean) => {
          setFixedVisible(val);
        }}
      />
      <Drawer
        title="Filter"
        placement="left"
        width="70%"
        onClose={() => {
          setMobileFilter(false);
        }}
        open={mobileFilter}
      >
        <div className="condition-list">
          <ul>
            {["All", "Tokens", "NFTs", "Inscriptions"].map(
              (item: string, index: number) => {
                return (
                  <li
                    key={index}
                    className={`${
                      item === "NFTs" || item === "Tokens" ? "" : "dis-c"
                    } ${assetsType === item ? "active-condition" : ""}`}
                    onClick={() => {
                      if (item !== "NFTs" && item !== "Tokens") return;
                      setAssetsType(item);
                      setMobileFilter(false);
                    }}
                  >
                    <p>{item}</p>
                  </li>
                );
              }
            )}
          </ul>
        </div>
      </Drawer>
      {/* <FooterNew/> */}
    </div>
  );
};

export default OwnerNFTSView;
