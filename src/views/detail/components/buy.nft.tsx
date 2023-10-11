import { Button, Modal, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { LAND, useContract, MarketAddress } from "../../../utils/contract";
import { PNft } from "../../../App";
import { useSwitchChain } from "../../../hooks/chain";
import { TaikoContractAddressMarketTest } from "../../../utils/source";
import { NFTBuyService } from '../../../request/api'
interface Item {
    price: string
    file_image_ipfs: string,
    order_id: string,
    pay_currency_name: string,
    token_id: number,
    image_minio_url: string
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
    const { queryERC20Approve, approveToken, buy, getBalance } = useContract();
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
        const bol = +approve / 1e18 >= +props.item.price / 1e18;
        setApproved(bol);
        setWait({
            ...wait,
            approve_dis: bol ? true : false,
            list_dis: bol ? false : true
        });
        if (props.item.pay_currency_name === 'ETH' || props.item.pay_currency_name === 'PI') {
            setWait({
                ...wait,
                approve_dis: true,
                list_dis: false
            });
            setApproved(true);
        }
    }
    useEffect(() => {
        props.visible && queryApproveFN();
        setVisible(props.visible);
    }, [props.visible]);
    const putApproveFN = async () => {
        await switchC(+(state.chain as string))
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
        await switchC(+(state.chain as string))
        setWait({
            ...wait,
            list_dis: true,
            list: true
        });
        const balance = await getBalance();
        const numberBalance: number = +balance / 1e18;
        const numberPrice: number = +props.item.price / 1e18;
        if (numberBalance < numberPrice) {
            message.warning('Your available balance is insufficient.');
            setWait({
                ...wait,
                list_dis: false,
                list: false
            });
            return
        }
        const hash: any = await buy(props.item.order_id, props.item.price, props.item.pay_currency_name);
        if (!hash || hash.message) {
            setWait({
                ...wait,
                list_dis: false,
                list: false
            });
            return
        };
        const upService = await NFTBuyService({
            chain_id: state.chain,
            sender: state.address,
            tx_hash: hash['transactionHash']
        });
        setWait({
            ...wait,
            list_dis: false,
            list: false
        });
        message.success('Buy Successful!');
        setVisible(false);
        props.closeModal(false);
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
                            <img src={props.item.file_image_ipfs || props.item.image_minio_url} alt="" />
                        </div>
                        <p className="nft-name">PAI SPACE</p>
                        <p className="token-id">#{props.item.token_id}</p>
                    </div>
                }
                <p className="label">Price</p>
                <p className="price-text">
                    {+props.item.price / 1e18}&nbsp;{props.item.pay_currency_name}
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