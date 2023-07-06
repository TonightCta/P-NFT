import { ReactElement, ReactNode, useContext, useState } from "react";
import './index.scss'
import TabList from "./components/tab.list";
import { Button, Spin, message } from "antd";
import VerifyModal from "./components/verify.address";
import { useContract } from "../../utils/contract";
import { PNft } from "../../App";
import { web3 } from "../../utils/types";
import { calsAddress } from "../../utils";
import { NFTBuyService } from "../../request/api";

const DetailView = (): ReactElement<ReactNode> => {
    const [active, setActive] = useState<number>(0);
    const { buy } = useContract();
    const { state } = useContext(PNft);
    const [item, setItem] = useState<any>(state.card);
    const [virifyVisible, setVerifyVisible] = useState<boolean>(false);
    const [imgLoad, setImgLoad] = useState<boolean>(true);
    const [wait, setWait] = useState<boolean>(false);
    const buyNFTFN = async () => {
        setWait(true)
        const result:any = await buy(item.token_id, item.price);
        setWait(false)
        console.log(result);
        if (!result || result.message) {
            return
        }
        const maker = await NFTBuyService({
            chain_id: '8007736',
            sender: state.address,
            tx_hash: result['transactionHash']
        });
        const { status } = maker;
        if(status !== 200){
            message.error(maker.message);
            return
        };
        message.success('Successful Purchase!');
    }
    return (
        <div className="detail-view">
            <div className="nft-msg">
                <div className="left-nft-box">
                    <img src={item.file_image_ipfs} onLoad={() => {
                        setImgLoad(false);
                    }} alt="" />
                    {imgLoad && <div className="load-box">
                        <Spin size="large" />
                    </div>}
                </div>
                <div className="right-nft-msg">
                    <p className="msg-name">
                        <img src={require('../../assets/images/favicon.png')} alt="" />
                        BabyBunny
                    </p>
                    <p className="nft-num">#{item.token_id}</p>
                    <p className="nft-remark">Owner by <span>{calsAddress(item.seller)}</span></p>
                    <div className="edit-box">
                        <div className="inner-top">
                            <div className="price-msg">
                                <p>{Number(web3.utils.fromWei(item.price, 'ether')).toFixed(2)}&nbsp;{item.paymod}</p>
                                <p>Price($64,567.12)</p>
                            </div>
                            <div className="btn-oper">
                                {state.address?.toUpperCase() !== item.seller.toUpperCase() && <Button onClick={buyNFTFN} disabled={wait}>
                                    {!wait
                                        ? <span>Buy</span>
                                        : <Spin size="small" />
                                    }
                                </Button>}
                                {/* <p><span>Cancel</span> the listing</p> */}
                            </div>
                        </div>
                        <div className="msg-switch">
                            <div className="msg-tabs">
                                <ul>
                                    {
                                        ['Attributes', 'Info'].map((item: string, index: number): ReactElement => {
                                            return (
                                                <li key={index} className={`${active === index ? 'active-tab-msg' : ''}`} onClick={() => {
                                                    setActive(index)
                                                }}>{item}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            <ul className="msg-list">
                                <li>
                                    <p>CONTRACT</p>
                                    <p>{item.contract_address}</p>
                                </li>
                                <li>
                                    <p>TOKEN ID</p>
                                    <p>{item.token_id}</p>
                                </li>
                                <li>
                                    <p>BLOCKCHAIN</p>
                                    <p>Plian Mainnet Subchain 1</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
            <div className="list-filter">
                <div className="tab-btn">
                    <ul>
                        <li>Activities</li>
                    </ul>
                </div>
                <div className="search-inp">
                    <input type="text" placeholder="Search" />
                </div>
            </div>
            <TabList />
            {/* 验证地址 */}
            <VerifyModal visible={virifyVisible} closeModal={(val: boolean) => {
                setVerifyVisible(val)
            }} />
        </div>
    )
};

export default DetailView;