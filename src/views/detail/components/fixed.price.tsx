import { DownOutlined } from "@ant-design/icons";
import { Button, DatePicker, Modal, Popover, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { LAND, useContract, MODE } from "../../../utils/contract";
import { PNft } from "../../../App";
import { NFTMakerService } from "../../../request/api";
import * as Addresses from "../../../utils/source";
import { useSwitchChain } from "../../../hooks/chain";
import { DateConvert, FilterAddress, FilterAddressToName } from "../../../utils";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { RangePickerProps } from 'antd/es/date-picker';

dayjs.extend(customParseFormat);
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < dayjs().subtract(1, 'days');
};
interface Props {
    visible: boolean,
    closeModal: (val: boolean) => void,
    sell?: boolean,
    id: number,
    image: string,
    upRefresh: () => void,
    chain: string,
    name: string,
    collection: string,
    nft_address:string
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

interface Duration {
    text: string,
    value: number
}

// const MODE: string = process.env.REACT_APP_CURRENTMODE as string;
const OwnerAddress: string[] = [Addresses.PlianContractAddressMarketMain, Addresses.PlianContractAddressMarketTest, Addresses.TaikoContractAddressMarketMain, Addresses.TaikoContractAddressMarketTest, Addresses.OPContractAddress721Main,Addresses.MintV2ContractAddress]
const DurationList: Duration[] = [
    {
        text: 'Custom',
        value: 999
    },
    {
        text: '1 day',
        value: 1
    },
    {
        text: '7 day',
        value: 7
    },
    {
        text: '1 month',
        value: 31
    },
    {
        text: '6 months',
        value: 186
    }
]
const FixedModal = (props: Props): ReactElement => {
    const [visible, setVisible] = useState<boolean>(false);
    const { state } = useContext(PNft)
    const [token, setToken] = useState<Token>({
        symbol: LAND === 'taiko' ? 'ETH' : MODE === 'production' ? 'PI' : 'MAPI',
        icon: LAND === 'taiko' ? 'https://static.optimism.io/data/ENS/logo.png' : require('../../../assets/images/pi_logo.png'),
        address: LAND === 'taiko' ? Addresses.SystemAddress : MODE === 'production' ? Addresses.SystemAddress : FilterAddress(state.chain as string).contract_erc20,
    });
    const { putApprove, putList, queryApprove, signOrder } = useContract();
    const [price, setPrice] = useState<number | string>('0');
    const { switchC } = useSwitchChain();
    const [tokenBox, setTokenBox] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(31);
    const [durationBox, setDurationBox] = useState<boolean>(false);
    const [selectEndDate, setSelectEndDate] = useState<string>('');
    const [endTimeStamp, setEndTimeStamp] = useState<number>(0);
    // const { data } = useGetNFTApprove(props.id);
    // const { write, approveData, approveStatus } = useSetNFTApprove(props.id)
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
                    FilterAddressToName(props.chain).token.map((item: Token, index: number) => {
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
    const contentDuration = (
        <div className="token-list">
            <ul>
                {
                    DurationList.map((item: Duration, index: number) => {
                        return (
                            <li className={`${item.value === duration ? 'active-token' : ''}`} key={index} onClick={() => {
                                setDuration(item.value)
                                setDurationBox(false);
                            }}>
                                <p>{item.text}</p>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );
    const queryApproveFN = async () => {
        // const approve = useGetNFTApprove(props.id);
        // console.log(approve)
        const approve = await queryApprove(props.id,props.nft_address);
        const bol = OwnerAddress.indexOf(approve.toLowerCase()) > -1;
        setApproved(bol);
        console.log(approve)
        setWait({
            ...wait,
            approve_dis: bol ? true : false,
            list_dis: bol ? false : true,
            // approve_dis: false,
            // list_dis: true
        })
    }
    useEffect(() => {
        const setOP = () => {
            setToken({
                symbol: FilterAddressToName(props.chain).token[0].symbol,
                icon: FilterAddressToName(props.chain).token[0].icon,
                address: FilterAddressToName(props.chain).token[0].address
            })
        }
        props.visible && setTimeout(() => {
            queryApproveFN()
        }, 1000);
        props.visible && setOP();
        setVisible(props.visible)
    }, [props.visible]);
    // useEffect(() => {
    //     console.log(approveSta)
    // },[approveStatus])
    const putApproveFN = async () => {
        await switchC(+props.chain);
        // write?.();
        // return
        setWait({
            ...wait,
            approve_dis: true,
            approve: true
        })
        const hash: any = await putApprove(props.id,props.nft_address);
        if (!hash || hash.message) {
            setWait({
                ...wait,
                approve_dis: false,
                approve: false
            });
            // message.error(hash.message)
            return
        }
        queryApproveFN()
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
        await switchC(+props.chain)
        setWait({
            ...wait,
            list_dis: true,
            list: true
        });
        let maker: any;
        if (props.chain === '10') {
            const signature: any = await signOrder(+price, parseInt(String(new Date().getTime() / 1000)), parseInt(String(endTimeStamp)), props.id);
            if (!signature || signature.message) {
                setWait({
                    ...wait,
                    list_dis: false,
                    list: false
                });
                message.error(signature.message)
                return
            };
            let v = parseInt(signature.slice(-2), 16)
            if (v < 27) {
                v += 27
            }
            const normalizedSignature = signature.slice(0, -2) + v.toString(16)
            maker = await NFTMakerService({
                chain_id: props.chain,
                sender: state.address,
                start_time: parseInt(String(new Date().getTime() / 1000)),
                end_time: parseInt(String(endTimeStamp)),
                token_id: props.id,
                price: price,
                signature: normalizedSignature
            });
        } else {
            const hash: any = await putList(props.id, +price, token.address,props.nft_address);
            if (!hash || hash.message) {
                setWait({
                    ...wait,
                    list_dis: false,
                    list: false
                });
                message.error(hash.message)
                return
            }
            maker = await NFTMakerService({
                chain_id: props.chain,
                sender: state.address,
                tx_hash: hash['transactionHash']
            });
        }
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
        message.success('List Successful!');
        setVisible(false);
        props.closeModal(false);
        props.upRefresh();
        setWait({
            approve: false,
            list: false,
            approve_dis: true,
            list_dis: true
        })
    };
    useEffect(() => {
        if (duration === 999) {
            return
        };
        setSelectEndDate(DateConvert(new Date().getTime() / 1000 + duration * 86400));
        setEndTimeStamp(new Date().getTime() / 1000 + duration * 86400);
    }, [duration]);
    return (
        <Modal open={visible} width={560} maskClosable onCancel={() => {
            setVisible(false);
            props.closeModal(false);
            setWait({
                approve: false,
                list: false,
                approve_dis: true,
                list_dis: true
            })
        }} title={props.sell ? 'Sell Your NFT' : 'Change Price'} footer={null}>
            <div className="fixed-price-inner">
                {
                    props.sell && <div className="sell-nft">
                        <div className="nft-box">
                            <div className="p-1">
                                <img src={props.image} alt="" />
                            </div>
                            <div className="nft-info">
                                <div className="inf-left p-inf">
                                    <p>{props.name}&nbsp;#{props.id}</p>
                                    <p>{props.collection}</p>
                                </div>
                                <div className="inf-right p-inf">
                                    Listing price
                                    <p>{(!price || price == '0') ? '--' : price}&nbsp;&nbsp;{token.symbol}</p>
                                </div>
                            </div>
                        </div>
                        {/* <p className="nft-name">PAI SPACE</p>
                        <p className="token-id">#{props.id}</p> */}
                    </div>
                }
                <p className="label">Price</p>
                <div className="inp-and-coin">
                    <input type="number" placeholder="0.0" value={price} onChange={(e) => {
                        setPrice(e.target.value)
                    }} onWheel={(e: any) => e.target?.blur()} />
                    <Popover open={tokenBox} onOpenChange={(e: boolean) => {
                        setTokenBox(e);
                    }} content={content} title={null} placement="bottom" trigger={['click']}>
                        <div className="coin-select">
                            <img src={token.icon} alt="" />
                            <p>{token.symbol}</p>
                            <DownOutlined />
                        </div>
                    </Popover>
                </div>
                <p className="label n-t">Duration</p>
                <div className="set-duration">
                    <Popover open={durationBox} onOpenChange={(e: boolean) => {
                        setDurationBox(e);
                    }} placement="bottom" content={contentDuration} trigger={['click']}>
                        <div className={`left-end-date date-box ${durationBox ? 'show-pop' : ''}`} onClick={() => {
                            setDurationBox(!durationBox)
                        }}>
                            <p>{DurationList.filter((item: Duration) => { return item.value === duration })[0].text}</p>
                            <DownOutlined />
                        </div>
                    </Popover>
                    <div className="right-start-date date-box">
                        <DatePicker
                            format="MM/DD - YYYY"
                            onChange={(e) => {
                                setDuration(999);
                                setEndTimeStamp(new Date(dayjs(e).format('YYYY-MM-DD')).getTime() / 1000)
                            }}
                            value={dayjs(selectEndDate)}
                            disabledDate={disabledDate}
                            style={{ width: '100%', height: `${Addresses.flag ? '32' : '40'}px`, borderColor: '#ccc' }}
                        />
                    </div>
                </div>
                <ul className="sale-msg">
                    <li>
                        <p>Listing price{Addresses.flag}</p>
                        <p>{price}&nbsp;{token.symbol}</p>
                    </li>
                    <li>
                        <p>Fee</p>
                        <p>{props.chain === '10' ? '2.5' : '2'}%</p>
                    </li>
                    <li>
                        <p>Total potential earnings</p>
                        <p>{+price - (props.chain === '10' ? +price * 0.025 : +price * 0.02)}&nbsp;{token.symbol}</p>
                    </li>
                </ul>
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