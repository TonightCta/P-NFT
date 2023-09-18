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
        play:false
    });
    const { state } = useContext(PNft);
    const { takeOff } = useContract();
    const [workBox, setWorkBox] = useState<boolean>(false);
    const [workID, setWorkID] = useState<number>(0);
    const [player, setPlayer] = useState<any>();
    const [fixedVisible, setFixedVisible] = useState<boolean>(false);
    useEffect(() => {
        setItem({
            ...props.item,
            play:false
        })
    }, [props.item])
    const confirm = async () => {
        await switchC(Number(process.env.REACT_APP_CHAIN))
        const hash: any = await takeOff(+item.order_id);
        if (!hash || hash.message) {
            return
        };
        const maker = await MFTOffService({
            chain_id: process.env.REACT_APP_CHAIN,
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
                <img src={props.item.file_image_ipfs} alt="" />
                {props.type === 1
                    ? <Popconfirm
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
                    : <Button type="primary" className="sell-btn" onClick={() => {
                        setFixedVisible(true)
                    }}>
                        <FlagOutlined />
                        Sell
                    </Button>
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
                <Tooltip title="Contest submit">
                    <Button className="submit-btn" onClick={() => {
                        setWorkID(props.item.token_id);
                        setWorkBox(true);
                    }} type="primary">
                        <IconFont type="icon-jiangbei" />
                    </Button>
                </Tooltip>
            </div>
            <p className="coll-name">Pai Space</p>
            <div className="nft-msg">
                <p>{props.item.file_name}&nbsp;#{props.item.token_id}</p>
                {props.type === 1 && <p className="nft-price">{web3.utils.fromWei(props.item.price as string, 'ether')}&nbsp;{props.item.paymod}</p>}
            </div>
            <FixedModal upRefresh={() => {
                props.upload && props.upload();
            }} sell visible={fixedVisible} image={item.file_image_ipfs} id={item.token_id} closeModal={(val: boolean) => {
                setFixedVisible(val);
            }} />
            <EditWorkModal visible={workBox} work_id={workID} closeModal={(val: boolean) => {
                setWorkBox(val);
            }} />
        </div>
    )
};

export default NewNFTCard;