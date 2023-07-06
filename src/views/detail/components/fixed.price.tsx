import { DownOutlined } from "@ant-design/icons";
import { Button, Modal, Popover, Spin, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { useContract } from "../../../utils/contract";
import { PNft } from "../../../App";
import { web3 } from "../../../utils/types";
import { NFTMakerService } from "../../../request/api";

interface Props {
    visible: boolean,
    closeModal: (val: boolean) => void,
    sell?: boolean,
    id: number,
    image: string,
    upRefresh:() => void
}

const FixedModal = (props: Props): ReactElement => {
    const [visible, setVisible] = useState<boolean>(false);
    const [token, setToken] = useState<string>('MAPI');
    const { state } = useContext(PNft)
    const { putOn } = useContract();
    const [price, setPrice] = useState<number | string>('');
    const [wait, setWait] = useState<boolean>(false);
    const content = (
        <div className="token-list">
            {
                ['MAPI'].map((item: string, index: number) => {
                    return (
                        <p className={`${item === token ? 'active-token' : ''}`} key={index} onClick={() => {
                            setToken(item)
                        }}>{item}</p>
                    )
                })
            }
        </div>
    );
    useEffect(() => {
        setVisible(props.visible)
    }, [props.visible]);
    const putOnFN = async () => {
        if (!price) {
            message.error('Please enter the price');
            return
        };
        setWait(true)
        const hash: any = await putOn('0x1a0eCc31DACcA48AA877db575FcBc22e1FEE671b', props.id, +price);
        setWait(false)
        if (!hash || hash.message) {
            return
        }
        const maker = await NFTMakerService({
            chain_id: '8007736',
            sender: state.address,
            tx_hash: hash['transactionHash']
        });
        const { status } = maker;
        if(status !== 200){
            message.error(maker.message);
            return
        };
        message.success('Sell Successful!');
        setVisible(false);
        props.upRefresh();
    }
    return (
        <Modal open={visible} width={480} maskClosable onCancel={() => {
            setVisible(false);
            props.closeModal(false);
        }} title={props.sell ? 'Sell Your NFT' : 'Change Price'} footer={null}>
            <div className="fixed-price-inner">
                {
                    props.sell && <div className="sell-nft">
                        <div className="nft-box">
                            <img src={props.image} alt="" />
                        </div>
                        <p className="nft-name">BabyBunny</p>
                        <p className="token-id">XXXX #{props.id}</p>
                    </div>
                }
                <p className="label">Price</p>
                <div className="inp-and-coin">
                    <input type="number" placeholder="0.0" value={price} onChange={(e) => {
                        setPrice(e.target.value)
                    }} onWheel={(e: any) => e.target?.blur()} />
                    <Popover content={content} title={null} placement="bottom">
                        <div className="coin-select">
                            <p>{token}</p>
                            <DownOutlined />
                        </div>
                    </Popover>
                </div>
                <p className="remark">List your NFT to sell for 0.0 MAPI</p>
                <p className="submit-btn">
                    <Button disabled={wait} onClick={() => {
                        putOnFN()
                    }}>
                        {
                            !wait
                                ? <span>Start listing</span>
                                : <Spin size="small" />
                        }
                    </Button>
                </p>
            </div>
        </Modal>
    )
};

export default FixedModal;