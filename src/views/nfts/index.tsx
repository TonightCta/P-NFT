import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import { Pagination, Spin } from 'antd'
import { WalletNFT } from '../../request/api'
import { NFTItem } from "../../utils/types";
import OwnerCard from "./components/owner.card";
import { useParams } from "react-router-dom";
import MaskCard from "../../components/mask";
import { PNft } from "../../App";
import { VERSION } from "../../utils/source";
import NewNFTCard from "./components/new.card";
// import FooterNew from "../screen.new/components/footer.new";

const OwnerNFTSView = (): ReactElement<ReactNode> => {
    const [activeTop, setActiveTop] = useState<number>(0);
    const [list, setList] = useState<NFTItem[]>([]);
    const searchParams = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [itemList, setItemList] = useState<NFTItem[]>([])
    const { state } = useContext(PNft);
    const [otherBg, setOtherBG] = useState<string>('1');
    const [loadingBg, setLoadingBg] = useState<boolean>(true);
    //On Sle
    const saleListFN = async () => {
        setLoading(true);
        const result = await WalletNFT({
            chain_id: state.chain,
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
                is_start:false
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
            chain_id: state.chain,
            address: searchParams.address,
            is_onsale: false,
            page_size: 18,
            page_num: page
        });
        setLoading(false);
        const { data } = result;
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
                is_start:false
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
    }, [searchParams.address, page, state.chain]);
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
    }
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
                    <OwnerCard updateList={(val:number) => {
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
                        <div className={`conponenst-gater ${loading ? 'gater-6n' : ''}`} id="ownerView">
                            <div className="list-item" >
                                {loading && <div className="load-data-box">
                                    <Spin size="large" />
                                </div>}
                                {
                                    (activeTop === 0 ? list : itemList).map((item: NFTItem, index: number) => {
                                        // [1,2,3,4,5,6,7,8].map((item: any, index: number) => {
                                        return (
                                            <NewNFTCard type={activeTop === 0 ? 1 : 2} key={index} item={item} uploadSell={() => {
                                                setList([]);
                                                setPage(1);
                                                setLoading(true);
                                                saleListFN();
                                            }} upload={() => {
                                                setItemList([]);
                                                setLoading(true);
                                                itemQuery();
                                            }} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                        {
                            activeTop === 0 && total === 0 && !loading && <p className="no-more">No more</p>
                        }
                        {total > 0 && !loading && <div className="page-oper">
                            <Pagination defaultCurrent={1} pageSize={12} total={total} onChange={(page) => {
                                window.scrollTo({
                                    top: 220,
                                    behavior: 'smooth'
                                })
                                setPage(page)
                            }} />
                        </div>}
                    </div>
                </div>
            </div>
            {/* <FooterNew/> */}
        </div>
    )
};

export default OwnerNFTSView;