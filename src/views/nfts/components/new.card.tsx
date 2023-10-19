import { ReactElement, useContext, useEffect, useState } from "react";
import { NFTItem, web3 } from "../../../utils/types";
import { Button, Popconfirm, Popover, Tooltip, message } from "antd";
import IconFont from "../../../utils/icon";
import { FlagOutlined, MoreOutlined, ToTopOutlined } from "@ant-design/icons";
import { useSwitchChain } from "../../../hooks/chain";
import { useContract } from "../../../utils/contract";
import { MFTOffService } from "../../../request/api";
import { PNft } from "../../../App";
import FixedModal from "../../detail/components/fixed.price";
import EditWorkModal from "./edit.work";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Props {
    uploadSell: () => void,
    upload: () => void,
    item: NFTItem,
    type: number
}

const NewNFTCard = (props: Props): ReactElement => {
    const { switchC } = useSwitchChain();
    const [item, setItem] = useState<NFTItem>({
        ...props.item,
        play: false
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const { state } = useContext(PNft);
    const [open, setOpen] = useState(false);
    const { takeOff } = useContract();
    const [workBox, setWorkBox] = useState<boolean>(false);
    const [workID, setWorkID] = useState<number>(0);
    const [player, setPlayer] = useState<any>();
    const [fixedVisible, setFixedVisible] = useState<boolean>(false);
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
        await switchC(+(state.chain as string));
        const hash: any = await takeOff(+item.order_id);
        if (!hash || hash.message) {
            return
        };
        const maker = await MFTOffService({
            chain_id: state.chain,
            sender: state.address,
            tx_hash: hash['transactionHash']
        });
        const { status } = maker;
        if (status !== 200) {
            message.error(maker.message);
            return
        };
        message.success('Take off the shelves Successfully!');
        props.uploadSell && props.uploadSell()
    };
    const content = (
        <div className="more-options">
            <ul onClick={() => {
                setOpen(false)
            }}>
                <li onClick={() => {
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
            <div className={`nft-box`}>
                <img src={props.item.image_minio_url} alt="" />
                {props.item.file_voice_minio_url && <div className="play-btn" onClick={(e) => {
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
                    play.src = item.file_voice_ipfs;
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
            <div className="nft-msg">
                <p>{props.item.file_name}&nbsp;#{props.item.token_id}</p>
                {props.type === 1 && <p className="nft-price">{web3.utils.fromWei(props.item.price as string, 'ether')}&nbsp;{props.item.pay_currency_name}</p>}
            </div>
            <div className="oper-box">
                {props.type === 1 && <div className="left-text">
                    {
                        searchParams.get('address') !== state.address
                            ?
                            <p onClick={() => {
                                navigate(`/detail?fid=${props.item.fid}`)
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
                        <p onClick={() => {
                            if (!props.item.for_sale) {
                                message.info('Coming soon');
                                return
                            }
                            setFixedVisible(true)
                        }}>Sell</p>
                    </div>
                }
                {state.address === searchParams.get('address') && <div className={`more-options`}>
                    <Tooltip title="More options">
                        <Popover onOpenChange={handleOpenChange} open={open} placement={`topLeft`} title={null} content={content} trigger="click">
                            <MoreOutlined />
                        </Popover>
                    </Tooltip>
                </div>}
            </div>
            <FixedModal chain={props.item.chain_id} upRefresh={() => {
                props.upload && props.upload();
            }} sell visible={fixedVisible} image={item.image_minio_url} id={item.token_id} closeModal={(val: boolean) => {
                setFixedVisible(val);
            }} />
            <EditWorkModal visible={workBox} work_id={workID} closeModal={(val: boolean) => {
                setWorkBox(val);
            }} />
        </div>
    )
};

export default NewNFTCard;