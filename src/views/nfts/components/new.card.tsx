import { ReactElement, useContext, useEffect, useState } from "react";
import { NFTItem, web3 } from "../../../utils/types";
import { Button, Popconfirm, Tooltip, message } from "antd";
import IconFont from "../../../utils/icon";
import { FlagOutlined } from "@ant-design/icons";
import { useSwitchChain } from "../../../hooks/chain";
import { useContract } from "../../../utils/contract";
import { MFTOffService } from "../../../request/api";
import { PNft } from "../../../App";
import FixedModal from "../../detail/components/fixed.price";
import EditWorkModal from "./edit.work";
import { useSearchParams } from "react-router-dom";

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
    const { takeOff } = useContract();
    const [workBox, setWorkBox] = useState<boolean>(false);
    const [workID, setWorkID] = useState<number>(0);
    const [player, setPlayer] = useState<any>();
    const [fixedVisible, setFixedVisible] = useState<boolean>(false);
    useEffect(() => {
        setItem({
            ...props.item,
            play: false
        })
    }, [props.item])
    const confirm = async () => {
        await switchC(+(state.chain as string))
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
    return (
        <div className="new-nft-card">
            <div className="nft-box">
                <img src={props.item.image_minio_url} alt="" />
                {
                    state.address === searchParams.get('address') &&
                    <div>
                        {props.type === 1
                            ? <>
                                {
                                    props.item.for_unsale &&  <Popconfirm
                                        title="Take off the shelves"
                                        description="Are you sure to take off the shelves?"
                                        onConfirm={confirm}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button className="up-top">
                                            <IconFont type="icon-anzhuang_install" />
                                            Take Off
                                        </Button>
                                    </Popconfirm>
                                }
                            </>
                            : <>
                                {
                                    props.item.for_sale && <Button type="primary" className="sell-btn" onClick={() => {
                                        setFixedVisible(true)
                                    }}>
                                        <FlagOutlined />
                                        Sell
                                    </Button>
                                }
                            </>
                        }
                    </div>
                }
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
                {state.address === searchParams.get('address') && props.item.for_competetion && <Tooltip title="Contest submit">
                    <Button className="submit-btn" onClick={() => {
                        setWorkID(props.item.token_id);
                        setWorkBox(true);
                    }} type="primary">
                        <IconFont type="icon-jiangbei" />
                    </Button>
                </Tooltip>}
            </div>
            <p className="coll-name">{props.item.collection_name}</p>
            <div className="nft-msg">
                <p>{props.item.file_name}&nbsp;#{props.item.token_id}</p>
                {props.type === 1 && <p className="nft-price">{web3.utils.fromWei(props.item.price as string, 'ether')}&nbsp;{props.item.pay_currency_name}</p>}
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