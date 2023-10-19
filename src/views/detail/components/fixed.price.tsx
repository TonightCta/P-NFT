import { DownOutlined } from "@ant-design/icons";
import { Button, Modal, Popover, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { LAND, useContract, MODE } from "../../../utils/contract";
import { PNft } from "../../../App";
import { NFTMakerService } from "../../../request/api";
import { PNFTAddress, PlianContractAddressMarketMain, PlianContractAddressMarketTest, PlianContractERC20Test, SystemAddress, TaikoContractAddressMarketMain, TaikoContractAddressMarketTest } from "../../../utils/source";
import { useSwitchChain } from "../../../hooks/chain";
import { FilterAddress } from "../../../utils";

interface Props {
    visible: boolean,
    closeModal: (val: boolean) => void,
    sell?: boolean,
    id: number,
    image: string,
    upRefresh: () => void,
    chain:string
}

interface Wait {
    approve: boolean,
    list: boolean,
    approve_dis: boolean,
    list_dis: boolean
}
interface Token {
    symbol: string,
    icon: string,
    address: string
}

// const MODE: string = process.env.REACT_APP_CURRENTMODE as string;
const OwnerAddress: string[] = [PlianContractAddressMarketMain, PlianContractAddressMarketTest, TaikoContractAddressMarketMain, TaikoContractAddressMarketTest]

const TokenList: Token[] =
    LAND === 'taiko'
        ? [
            {
                symbol: 'ETH',
                icon: "https://static.optimism.io/data/ETH/logo.svg",
                address: SystemAddress
            },
            {
                symbol: 'BLL',
                icon: "https://ipfs.io/ipfs/QmezMTpT6ovJ3szb3SKDM9GVGeQ1R8DfjYyXG12ppMe2BY",
                address: "0x6302744962a0578E814c675B40909e64D9966B0d"
            },
            {
                symbol: 'HORSE',
                icon: "https://ipfs.io/ipfs/QmU52ZxmSiGX24uDPNUGG3URyZr5aQdLpACCiD6tap4Mgc",
                address: "0xa4505BB7AA37c2B68CfBC92105D10100220748EB"
            },
            {
                symbol: 'TTKO',
                icon: "https://ipfs.io/ipfs/Qmd7dsvTKZBYJmQ6Mhse4hWbEx8faT4AnCMfByK5j9C8yS",
                address: "0x7b1a3117B2b9BE3a3C31e5a097c7F890199666aC"
            }
        ]
        : MODE === 'production'
            ? [
                {
                    symbol: 'PI',
                    icon: require('../../../assets/images/pi_logo.png'),
                    address: SystemAddress
                },
                {
                    symbol: 'PNFT',
                    icon: require('../../../assets/images/pi_logo.png'),
                    address: PNFTAddress
                },
            ]
            : [
                {
                    symbol: 'MAPI',
                    icon: require('../../../assets/images/pi_logo.png'),
                    address: PlianContractERC20Test
                }
            ];


const FixedModal = (props: Props): ReactElement => {
    const [visible, setVisible] = useState<boolean>(false);
    const { state } = useContext(PNft)
    const [token, setToken] = useState<Token>({
        symbol:LAND === 'taiko' ? 'ETH' : MODE === 'production' ? 'PI' : 'MAPI',
        icon:LAND === 'taiko' ? 'https://static.optimism.io/data/ENS/logo.png' : require('../../../assets/images/pi_logo.png'),
        address:LAND === 'taiko' ? SystemAddress : MODE === 'production' ? SystemAddress : FilterAddress(state.chain as string).contract_erc20,
    });
    const { putApprove, putList, queryApprove } = useContract();
    const [price, setPrice] = useState<number | string>('0');
    const { switchC } = useSwitchChain();
    const [tokenBox,setTokenBox] = useState<boolean>(false);
    const [wait, setWait] = useState<Wait>({
        approve: false,
        list: false,
        approve_dis: true,
        list_dis: true
    });
    const [approved, setApproved] = useState<boolean>(false);
    const content = (
        <div className="token-list">
            <ul>
                {
                    TokenList.map((item: Token, index: number) => {
                        return (
                            <li className={`${item.symbol === token.symbol ? 'active-token' : ''}`} key={index} onClick={() => {
                                setToken(item);
                                setTokenBox(false);
                            }}>
                                <img src={item.icon} alt="" />
                                <p>{item.symbol}</p>
                            </li>
                        )
                    })
                }
            </ul>
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
        await switchC(+props.chain)
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
        await switchC(+(state.chain as string))
        setWait({
            ...wait,
            list_dis: true,
            list: true
        });
        const LAND: string = process.env.REACT_APP_LAND as string;
        const hash: any = await putList(props.id, +price, token.address);
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
            chain_id: state.chain,
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
                    <Popover open={tokenBox} onOpenChange={(e:boolean) => {
                        setTokenBox(e);
                    }} content={content} title={null} placement="bottom" trigger={['click']}>
                        <div className="coin-select">
                            <img src={token.icon} alt="" />
                            <p>{token.symbol}</p>
                            <DownOutlined />
                        </div>
                    </Popover>
                </div>
                <p className="remark">List your NFT to sell for {price} {token.symbol}</p>
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