import { DownOutlined } from "@ant-design/icons";
import { Button, Modal, Popover, Spin, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { useContract } from "../../../utils/contract";
import { PNft } from "../../../App";
import { NFTMakerService } from "../../../request/api";
import { PlianContractAddressMarketMain, PlianContractAddressMarketTest } from "../../../utils/source";

interface Props {
    visible: boolean,
    closeModal: (val: boolean) => void,
    sell?: boolean,
    id: number,
    image: string,
    upRefresh: () => void
}

interface Wait {
    approve: boolean,
    list: boolean,
    approve_dis: boolean,
    list_dis: boolean
}

const MODE: string = process.env.REACT_APP_CURRENTMODE as string;
const OwnerAddress: string[] = [PlianContractAddressMarketMain, PlianContractAddressMarketTest]

const FixedModal = (props: Props): ReactElement => {
    const [visible, setVisible] = useState<boolean>(false);
    const [token, setToken] = useState<string>(MODE === 'production' ? 'PI' : 'MAPI');
    const { state } = useContext(PNft)
    const { putApprove, putList, queryApprove } = useContract();
    const [price, setPrice] = useState<number | string>('0');
    const [wait, setWait] = useState<Wait>({
        approve: false,
        list: false,
        approve_dis: true,
        list_dis: true
    });
    const [approved, setApproved] = useState<boolean>(false);
    const content = (
        <div className="token-list">
            {
                MODE === 'production' ? ['PI'] : ['MAPI'].map((item: string, index: number) => {
                    return (
                        <p className={`${item === token ? 'active-token' : ''}`} key={index} onClick={() => {
                            setToken(item)
                        }}>{item}</p>
                    )
                })
            }
        </div>
    );
    const queryApproveFN = async () => {
        const approve = await queryApprove(props.id);
        const bol = OwnerAddress.indexOf(approve) > -1;
        setApproved(bol);
        setWait({
            ...wait,
            approve_dis: bol ? true : false,
            list_dis: bol ? false : true
        })
    }
    useEffect(() => {
        props.visible && queryApproveFN();
        setVisible(props.visible)
    }, [props.visible]);
    const putApproveFN = async () => {
        setWait({
            ...wait,
            approve_dis: true,
            approve: true
        })
        const hash: any = await putApprove(props.id);
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
        if (!price) {
            message.error('Please enter the price');
            return
        };
        setWait({
            ...wait,
            list_dis: true,
            list: true
        });
        const hash: any = await putList(props.id, +price);
        if (!hash || hash.message) {
            setWait({
                ...wait,
                list_dis: false,
                list: false
            });
            // message.error(hash.message)
            return
        }
        const maker = await NFTMakerService({
            chain_id: '8007736',
            sender: state.address,
            tx_hash: hash['transactionHash']
        });
        setWait({
            ...wait,
            list_dis: false,
            list: false
        });
        const { status } = maker;
        if (status !== 200) {
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
                        <p className="nft-name">PAI SPACE</p>
                        <p className="token-id">#{props.id}</p>
                    </div>
                }
                <p className="label">Price</p>
                <div className="inp-and-coin">
                    <input type="number" placeholder="0.0" value={price} onChange={(e) => {
                        setPrice(e.target.value)
                    }} onWheel={(e: any) => e.target?.blur()} />
                    <Popover content={content} title={null} placement="bottom">
                        <div className="coin-select">
                            <img src={require('../../../assets/images/pi_logo.png')} alt="" />
                            <p>{token}</p>
                            <DownOutlined />
                        </div>
                    </Popover>
                </div>
                <p className="remark">List your NFT to sell for {price} {MODE === 'production' ? 'PI' : 'MAPI'}</p>
                <div className="submit-btn">
                    <div className="btns-oper">
                        <Button className={`${(wait.approve_dis && !wait.approve) ? 'disable-btn' : ''}`} disabled={wait.approve_dis} loading={wait.approve} onClick={() => {
                            putApproveFN()
                        }}>Approve</Button>
                        <Button className={`${wait.list_dis && !wait.list ? 'disable-btn' : ''}`} disabled={wait.list_dis} loading={wait.list} onClick={() => {
                            putListFN()
                        }}>
                            Listing
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

export default FixedModal;