import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import { Pagination, Spin, Popover, message } from 'antd'
import { MFTOffService, WalletNFT } from '../../request/api'
import { NFTItem } from "../../utils/types";
import OwnerCard from "./components/owner.card";
import { useParams } from "react-router-dom";
import MaskCard from "../../components/mask";
import { PNft } from "../../App";
import { VERSION } from "../../utils/source";
import NewNFTCard from "./components/new.card";
import { DownOutlined } from "@ant-design/icons";
import FixedModal from "../detail/components/fixed.price";
import { useContract } from "../../utils/contract";
import { useSwitchChain } from "../../hooks/chain";
// import FooterNew from "../screen.new/components/footer.new";

interface OP {
    label: string,
    value: string,
    icon: string
}

interface Sale {
    token_name: string,
    collection_name: string,
    chain_id: string,
    image_minio_url: string,
    token_id: number
}

const options: OP[] = [
    {
        label: 'All Chains',
        value: '999',
        icon: '',
    },
    {
        label: 'Ethereum',
        value: '1',
        icon: require('../../assets/images/eth.logo.png'),
    },
    {
        label: 'Plian',
        value: '8007736',
        icon: require('../../assets/images/plian.logo.png'),
    },
    {
        label: 'Optimism',
        value: '10',
        icon: require('../../assets/images/op.logo.png'),
    },
    {
        label: 'Filecoin',
        value: '314',
        icon: require('../../assets/images/fil.logo.png'),
    },
    {
        label: 'PlatON',
        value: '210425',
        icon: require('../../assets/images/plat.logo.png'),
    },
]

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
    const [otherBg, setOtherBG] = useState<string>('1');
    const [loadingBg, setLoadingBg] = useState<boolean>(true);
    const { switchC } = useSwitchChain();
    const [open, setOpen] = useState(false);
    const [chainInfo, setChainInfo] = useState<OP>({
        label: 'All chains',
        value: '999',
        icon: ''
    });
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
            chain_id: chainInfo.value === '999' ? '' : chainInfo.value,
            is_onsale: true,
            address: searchParams.address,
            page_size: 12,
            page_num: page
        });
        setLoading(false);
        const { status, data } = result;
        if (status !== 200) {
            return
        };
        setTotal(data.total)
        if (!data.item) {
            setList([]);
            return
        };
        const filter = data.item.map((item: any) => {
            return item = {
                ...item,
                load: true,
                off: true,
                is_start: false
            }
        });
        setList(filter);
    };
    const loadMoreData = () => {
        activeTop === 0 ? saleListFN() : itemQuery();
    };
    const itemQuery = async () => {
        setLoading(true);
        const result: any = await WalletNFT({
            chain_id: chainInfo.value === '999' ? '' : chainInfo.value,
            address: searchParams.address,
            is_onsale: false,
            page_size: 18,
            page_num: page
        });
        setLoading(false);
        const { data } = result;
        setTotal(data.total);
        if (!data.item) {
            setItemList([])
            return
        };
        const filter = data.item.map((item: any) => {
            return item = {
                ...item,
                load: true,
                off: true,
                is_start: false
            }
        });
        setItemList(filter)
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
    }
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
        token_name: '',
        collection_name: '',
        chain_id: '8007736',
        image_minio_url: '',
        token_id: 0
    });
    const [fixedVisible, setFixedVisible] = useState<boolean>(false);
    const content = (
        <div className="select-chains">
            <ul>
                {
                    options.map((item: OP, index: number) => {
                        return (
                            <li key={index} onClick={() => {
                                setChainInfo(item);
                                hide()
                            }}>
                                {item.icon && <img src={item.icon} alt="" />}
                                <p>{item.label}</p>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
    return (
        <div className="owner-view">
            {VERSION === 'old' && <MaskCard />}
            <div className="up-mask">
                <div className="owner-bg">
                    <img className={`${calsBG() ? '' : 'max-height'}`} src={calsBG() ? calsBG() : require('../../assets/images/test_bg.png')} onLoad={() => {
                        setLoadingBg(false)
                    }} alt="" />
                    {loadingBg && <div className="loading-bg">
                        <Spin size="large" />
                    </div>}
                </div>
                <div className="owner-inner">
                    <OwnerCard updateList={(val: number) => {
                        selectTop(val)
                    }} updateBG={(_url: string) => {
                        setOtherBG(_url);
                    }} />
                    <div className="inner-data">
                        <div className="filter-box">
                            <div className="tabs">
                                <ul>
                                    {
                                        (searchParams.address === state.address ? ['On Sale', 'Wallet'] : ['On sale']).map((item: string, index: number): ReactElement => {
                                            return (
                                                <li key={index} className={`${activeTop === index ? 'active-top' : ''}`} onClick={() => {
                                                    selectTop(index)
                                                }}>{item}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            {/* <div className="search-box">
                                <input type="text" placeholder="Search" />
                            </div> */}
                        </div>
                        <div className="other-filter">
                            <Popover
                                placement="bottom"
                                className="select-chain-asset"
                                open={open}
                                onOpenChange={handleOpenChange}
                                trigger={['click']}
                                title={null}
                                content={content}>
                                <div className="ss-i">
                                    <div>
                                        {chainInfo.icon && <img src={chainInfo.icon} alt="" />}
                                        <p>{chainInfo.label}</p>
                                    </div>
                                    <DownOutlined />
                                </div>
                            </Popover>
                        </div>
                        <div className={`conponenst-gater ${loading ? 'gater-6n' : ''}`} id="ownerView">
                            <div className="list-item" >
                                {loading && <div className="load-data-box">
                                    <Spin size="large" />
                                </div>}
                                {
                                    (activeTop === 0 ? list : itemList).map((item: NFTItem, index: number) => {
                                        // [1,2,3,4,5,6,7,8].map((item: any, index: number) => {
                                        return (
                                            <NewNFTCard type={activeTop === 0 ? 1 : 2} key={index} item={item} uploadTakeoff={async () => {
                                                await switchC(+item.chain_id);
                                                const hash: any = await takeOff(+item.order_id);
                                                if (!hash || hash.message) {
                                                    return
                                                };
                                                const maker = await MFTOffService({
                                                    chain_id: item.chain_id,
                                                    sender: state.address,
                                                    tx_hash: hash['transactionHash']
                                                });
                                                const { status } = maker;
                                                if (status !== 200) {
                                                    message.error(maker.message);
                                                    return
                                                };
                                                message.success('Take off the shelves Successfully!');
                                                setList([]);
                                                setPage(1);
                                                setLoading(true);
                                                saleListFN();
                                            }} uploadSaleInfo={() => {
                                                setSale({
                                                    collection_name: item.collection_name,
                                                    token_id: item.token_id,
                                                    token_name: item.token_name,
                                                    chain_id: item.chain_id,
                                                    image_minio_url: item.image_minio_url
                                                });
                                                setFixedVisible(true);
                                            }} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                        {
                            total === 0 && !loading && <p className="no-more">No more</p>
                        }
                        <div className="page-oper">
                            <Pagination hideOnSinglePage defaultCurrent={1} pageSize={18} total={total} onChange={(page) => {
                                window.scrollTo({
                                    top: 220,
                                    behavior: 'smooth'
                                })
                                setPage(page)
                            }} />
                        </div>
                    </div>
                </div>
            </div>
            <FixedModal name={sale.token_name} collection={sale.collection_name} chain={sale.chain_id} upRefresh={() => {
                setItemList([]);
                setLoading(true);
                itemQuery();
            }} sell visible={fixedVisible} image={sale.image_minio_url} id={sale.token_id} closeModal={(val: boolean) => {
                setFixedVisible(val);
            }} />
            {/* <FooterNew/> */}
        </div>
    )
};

export default OwnerNFTSView;