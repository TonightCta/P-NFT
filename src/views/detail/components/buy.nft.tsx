import { Button, Modal, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { LAND, useContract, MarketAddress } from "../../../utils/contract";
import { PNft } from "../../../App";
import { useSwitchChain } from "../../../hooks/chain";
import { TaikoContractAddressMarketTest } from "../../../utils/source";
interface Item {
    price: string
    file_image_ipfs: string,
    order_id: string,
    paymod: string,
    token_id: number
}

interface Props {
    visible: boolean,
    closeModal: (val: boolean) => void,
    upRefresh: () => void,
    item: Item
}

interface Wait {
    approve: boolean,
    list: boolean,
    approve_dis: boolean,
    list_dis: boolean
}
const BuyNFTsModal = (props: Props): ReactElement => {
    const [visible, setVisible] = useState<boolean>(false);
    const { state } = useContext(PNft)
    const { queryERC20Approve, approveToken, buy } = useContract();
    const { switchC } = useSwitchChain();
    const [wait, setWait] = useState<Wait>({
        approve: false,
        list: false,
        approve_dis: true,
        list_dis: true
    });
    const [approved, setApproved] = useState<boolean>(false);
    const queryApproveFN = async () => {
        const approve = await queryERC20Approve(state.address as string, LAND === 'taiko' ? TaikoContractAddressMarketTest : MarketAddress);
        console.log(+approve / 1e18)
        const bol = +approve / 1e18 >= +props.item.price / 1e18;
        setApproved(bol);
        setWait({
            ...wait,
            approve_dis: bol ? true : false,
            list_dis: bol ? false : true
        })
    }
    useEffect(() => {
        props.visible && queryApproveFN();
        setVisible(props.visible);
        if (props.item.paymod === 'ETH' || props.item.paymod === 'PI') {
            setWait({
                ...wait,
                approve_dis: true,
                approve: false,
                list_dis: false
            });
            setApproved(true);
        }
    }, [props.visible]);
    const putApproveFN = async () => {
        await switchC(Number(process.env.REACT_APP_CHAIN))
        setWait({
            ...wait,
            approve_dis: true,
            approve: true
        })
        const hash: any = await approveToken();
        if (!hash || hash.message) {
            setWait({
                ...wait,
                approve_dis: false,
                approve: false
            });
            // message.error(hash.message)
            return
        }
        setWait({
            ...wait,
            approve_dis: true,
            approve: false,
            list_dis: false
        });
        setApproved(true);
    };
    const putListFN = async () => {
        await switchC(Number(process.env.REACT_APP_CHAIN))
        setWait({
            ...wait,
            list_dis: true,
            list: true
        });
        const hash: any = await buy(props.item.order_id, props.item.price, props.item.paymod);
        if (!hash || hash.message) {
            setWait({
                ...wait,
                list_dis: false,
                list: false
            });
            return
        }
        setWait({
            ...wait,
            list_dis: false,
            list: false
        });
        message.success('Sell Successful!');
        setVisible(false);
        props.upRefresh();
    }
    return (
        <Modal open={visible} width={480} maskClosable onCancel={() => {
            setVisible(false);
            props.closeModal(false);
        }} title="Buy NFT" footer={null}>
            <div className="fixed-price-inner">
                {
                    <div className="sell-nft">
                        <div className="nft-box">
                            <img src={props.item.file_image_ipfs} alt="" />
                        </div>
                        <p className="nft-name">PAI SPACE</p>
                        <p className="token-id">#{props.item.token_id}</p>
                    </div>
                }
                <p className="label">Price</p>
                <p className="price-text">
                    {+props.item.price / 1e18}&nbsp;{props.item.paymod}
                </p>
                <div className="submit-btn">
                    <div className="btns-oper">
                        <Button className={`${(wait.approve_dis && !wait.approve) ? 'disable-btn' : ''}`} disabled={wait.approve_dis} loading={wait.approve} onClick={() => {
                            putApproveFN()
                        }}>Approve</Button>
                        <Button className={`${wait.list_dis && !wait.list ? 'disable-btn' : ''}`} disabled={wait.list_dis} loading={wait.list} onClick={() => {
                            putListFN()
                        }}>
                            Buy now
                        </Button>
                    </div>
                    <p className={`p-line ${approved ? 'pass-line' : ''}`}>
                        <span className="start point"></span>
                        <span className="end point"></span>
                    </p>
                </div>
            </div>
        </Modal>
    )
};

export default BuyNFTsModal;