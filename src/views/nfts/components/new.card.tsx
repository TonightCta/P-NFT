import { ReactElement, useContext, useEffect, useState } from "react";
import { NFTItem, web3 } from "../../../utils/types";
import { Popconfirm, Popover, Spin, Tooltip, message } from "antd";
import IconFont from "../../../utils/icon";
import { MoreOutlined } from "@ant-design/icons";
import { useSwitchChain } from "../../../hooks/chain";
import { PNft } from "../../../App";
import EditWorkModal from "./edit.work";
import { useNavigate, useParams } from "react-router-dom";
import { FilterAddressToName, FilterChainInfo } from "../../../utils";
import { ErrorCard } from "../../../components/error.card";

interface Props {
    uploadSaleInfo: () => void,
    uploadTakeoff: () => void,
    item: NFTItem,
    type: number
}

const NewNFTCard = (props: Props): ReactElement => {
    const { switchC } = useSwitchChain();
    const [item, setItem] = useState<NFTItem>({
        ...props.item,
        play: false,
        load: true,
        error: false
    });
    const searchParams = useParams();
    const { state } = useContext(PNft);
    const [open, setOpen] = useState(false);
    const [workBox, setWorkBox] = useState<boolean>(false);
    const [workID, setWorkID] = useState<number>(0);
    const [player, setPlayer] = useState<any>();
    const navigate = useNavigate();
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    useEffect(() => {
        setItem({
            ...props.item,
            play: false
        })
    }, [props.item])
    const confirm = async () => {
        props.uploadTakeoff();
    };
    const content = (
        <div className="more-options">
            <ul onClick={() => {
                setOpen(false)
            }}>
                <li className={`${props.item.for_competetion ? '' : 'dis-btn'}`} onClick={() => {
                    if (!props.item.for_competetion) {
                        return
                    }
                    setWorkID(props.item.token_id);
                    setWorkBox(true);
                }}>
                    <img src={require('../../../assets/images/trophy.png')} alt="" />
                    <p>Contest Submit</p>
                </li>
                {/* {props.type === 1 && <Popconfirm
                    title="Take off the shelves"
                    description="Are you sure to take off the shelves?"
                    onConfirm={confirm}
                    okText="Yes"
                    cancelText="No"
                >
                    <li>
                        <IconFont type="icon-anzhuang_install" />
                        <p>Take off</p>
                    </li>
                </Popconfirm>} */}
                {/* {props.item.for_sale && <li onClick={() => {
                    setFixedVisible(true)
                }}>
                    <ToTopOutlined />
                    <p>Sell</p>
                </li>} */}
            </ul>
        </div>
    )
    return (
        <div className="new-nft-card">
            <div className="chain-logo">
                <img src={FilterChainInfo(props.item.chain_id).logo} alt="" />
            </div>
            <div className="nft-box">
                {item.load && <div className="loading-box-public">
                    <Spin size="large" />
                </div>}
                {item.error && <ErrorCard />}
                <img src={props.item.image_minio_url} alt="" onLoad={() => {
                    setItem({
                        ...item,
                        load: false
                    })
                }} onError={() => {
                    setItem({
                        ...item,
                        error: true
                    })
                }} />
                {item.voice_minio_url && <div className="play-btn" onClick={(e) => {
                    e.stopPropagation();
                    if (item.play) {
                        player.pause();
                        setItem({
                            ...item,
                            play: false
                        });
                        setPlayer(null);
                        return
                    }
                    const play = document.createElement('audio');
                    setPlayer(play)
                    play.src = item.voice_minio_url;
                    play.loop = false;
                    play.play();
                    setItem({
                        ...item,
                        play: true
                    });
                }}>
                    {
                        item.play
                            ? <IconFont type="icon-tingzhi" />
                            : <IconFont type="icon-play-fill" />
                    }
                </div>}
            </div>
            <p className="coll-name">{props.item.collection_name}</p>
            <p className="nft-name">{props.item.token_name}</p>
            <div className="nft-msg">
                <p>{props.item.file_name}&nbsp;#{props.item.token_id}</p>
                {props.type === 1 && <p className="nft-price">{web3.utils.fromWei(props.item.price as string, 'ether')}&nbsp;{props.item.pay_currency_name}</p>}
            </div>
            <div className="oper-box">
                {props.type === 1 && <div className="left-text">
                    {
                        searchParams.address !== state.address
                            ?
                            <p onClick={() => {
                                navigate(`/asset/${FilterAddressToName(props.item.chain_id).chain_name}/${props.item.contract_address}/${props.item.token_id}`)
                            }}>Buy Now</p>
                            :
                            <Popconfirm
                                title="Take off the shelves"
                                description="Are you sure to take off the shelves?"
                                onConfirm={confirm}
                                okText="Yes"
                                cancelText="No"
                            >
                                <p>Take off</p>
                            </Popconfirm>
                    }
                </div>}
                {
                    props.type === 2 && <div className="left-text">
                        <p onClick={async () => {
                            if (!props.item.for_sale) {
                                message.info('Coming soon');
                                return
                            };
                            const rr: any = await switchC(+props.item.chain_id);
                            if (rr?.message) {
                                return
                            }
                            props.uploadSaleInfo();
                        }}>Sell</p>
                    </div>
                }
                {state.address === searchParams.address && <div className={`more-options`}>
                    <Tooltip title="More options">
                        <Popover onOpenChange={handleOpenChange} open={open} placement={`topLeft`} title={null} content={content} trigger="click">
                            <MoreOutlined />
                        </Popover>
                    </Tooltip>
                </div>}
            </div>
            <EditWorkModal visible={workBox} nft_address={props.item.contract_address} work_id={workID} closeModal={(val: boolean) => {
                setWorkBox(val);
            }} />
        </div>
    )
};

export default NewNFTCard;