import { ReactElement, useContext, useEffect, useState } from "react";
import { NFTItem, web3 } from "../../../utils/types";
import { Button, Popconfirm, message } from "antd";
import IconFont from "../../../utils/icon";
import { FlagOutlined } from "@ant-design/icons";
import { useSwitchChain } from "../../../hooks/chain";
import { useContract } from "../../../utils/contract";
import { MFTOffService } from "../../../request/api";
import { PNft } from "../../../App";
import FixedModal from "../../detail/components/fixed.price";

interface Props {
    uploadSell: () => void,
    upload: () => void,
    item: NFTItem,
    type: number
}

const NewNFTCard = (props: Props): ReactElement => {
    const { switchC } = useSwitchChain();
    const [item, setItem] = useState<NFTItem>(props.item);
    const { state } = useContext(PNft);
    const { takeOff } = useContract();
    const [fixedVisible,setFixedVisible] = useState<boolean>(false);
    useEffect(() => {
        setItem(props.item)
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
        </div>
    )
};

export default NewNFTCard;