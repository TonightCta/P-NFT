import { Button, Modal, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { LAND, useContract } from "../../../utils/contract";
import { PNft } from "../../../App";
import { useSwitchChain } from "../../../hooks/chain";
import { PNFTAddress, TaikoContractAddressMarketTest } from "../../../utils/source";
import { NFTBuyService } from '../../../request/api'
import { FilterAddress } from "../../../utils";
interface Item {
    price: string
    file_image_ipfs: string,
    order_id: string,
    pay_currency_name: string,
    token_id: number,
    image_minio_url: string,
    pay_currency_contract: string,
    seaport_buy_Param: {
        fulfiller_conduit_key: string,
        signature: string
    }
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
    const { queryERC20Approve, approveToken, buy, getBalance, balanceErc20, OPBuy } = useContract();
    const { switchC } = useSwitchChain();
    const [wait, setWait] = useState<Wait>({
        approve: false,
        list: false,
        approve_dis: true,
        list_dis: true
    });
    const [approved, setApproved] = useState<boolean>(false);
    const queryApproveFN = async () => {
        const contract: string = props.item.pay_currency_contract;
        if (contract.slice(contract.length - 8, contract.length) === '00000000') {
            setWait({
                ...wait,
                approve_dis: true,
                list_dis: false
            });
            setApproved(true);
            return
        }
        const approve = await queryERC20Approve(state.address as string, LAND === 'taiko' ? TaikoContractAddressMarketTest : FilterAddress(state.chain as string).contract_market,PNFTAddress);
        const bol = +approve / 1e18 >= +props.item.price / 1e18;
        setApproved(bol);
        setWait({
            ...wait,
            approve_dis: bol ? true : false,
            list_dis: bol ? false : true
        });
        if (contract.slice(contract.length - 8, contract.length) === '00000000') {
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
        const hash: any = await approveToken(props.item.pay_currency_contract,FilterAddress(state.chain as string).contract_market);
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
        const contract: string = props.item.pay_currency_contract;
        const balance = contract.slice(contract.length - 8, contract.length) === '00000000' ? await getBalance() : await balanceErc20(contract);
        const numberBalance: number = contract.slice(contract.length - 8, contract.length) === '00000000' ? +balance / 1e18 : +balance;
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
        const hash: any = state.chain === '10' ? await OPBuy(props.item.price, props.item.seaport_buy_Param.fulfiller_conduit_key) : await buy(props.item.order_id, props.item.price, props.item.pay_currency_name);
        if (!hash || hash.message) {
            setWait({
                ...wait,
                list_dis: false,
                list: false
            });
            return
        };
        await NFTBuyService({
            chain_id: state.chain,
            sender: state.address,
            tx_hash: hash['transactionHash'],
            token_id: state.chain === '10' ? props.item.token_id : ''
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
            <div className="fixed-price-inner buy-inner">
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