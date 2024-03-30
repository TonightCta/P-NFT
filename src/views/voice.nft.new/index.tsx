import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import FooterNew from "../screen.new/components/footer.new";
import IconFont from "../../utils/icon";
import { Button, Select, message, Popover } from "antd";
import DesignBox from "./components/design.box";
import { CategoryList, LabelList } from "../../request/api";
import { CaretDownOutlined, CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Config, NetworkConfig, SystemAddress } from "../../utils/source";
import { PNft } from "../../App";
import { FilterAddressToName } from "../../utils";

interface Op {
    value: string | number,
    label: string,
    label_icon: string,
    bg?: string
}

interface TokenMsg {
    symbol: string,
    icon: string,
    address: string,
    fee: string
}

export interface Input {
    name: string,
    desc: string,
    category: number,
    nft_type: string,
    chain: string,
    labels: number[],
    token_info: TokenMsg
}

const VoiceNFTNewView = (): ReactElement<ReactNode> => {
    const [active, setActive] = useState<number>(0);
    const [show, setShow] = useState<boolean>(false);
    const [cateList, setCateList] = useState<Op[]>([]);
    const [labelsList, setLabelsList] = useState<Op[]>([]);
    const [labelsID, setLabelsID] = useState<number[]>([]);
    const [labelsText, setLabelsText] = useState<string[]>([]);
    const { state } = useContext(PNft);
    const [tokenPop, setTokenPop] = useState<boolean>(false);
    const [input, setInput] = useState<Input>({
        name: '',
        desc: '',
        category: 1,
        nft_type: '721',
        chain: state.chain as string,
        labels: [],
        token_info: {
            symbol: 'Pi',
            icon: require('../../assets/images/plian.logo.png'),
            address: SystemAddress,
            fee: '0.4'
        }
    });

    const getCategory = async () => {
        const result = await CategoryList({
            page_size: 100
        });
        const { data } = result;
        data.data.item = data.data.item.map((e: { category_id: number, category_name: string }) => {
            return {
                value: String(e.category_id),
                label: e.category_name
            }
        });
        setCateList(data.data.item);
    };
    const selectChain = (e: string) => {
        setInput({
            ...input,
            chain: e,
            token_info: FilterAddressToName(e).token[0]
        })
    }
    const isDisable = (_chain: string) => {
        const chian = _chain === '8007736' || _chain === '314' || _chain === '10' || _chain === '210425';
        if (state.wallet && state.wallet !== 'btc' && chian) {
            return false
        } else {
            return true
        }
    }
    const getLabels = async () => {
        const result = await LabelList({
            page_size: 100
        })
        const { data } = result;
        data.data.item = data.data.item.map((e: { label_id: number, label_name: string, label_icon: string }) => {
            return {
                value: String(e.label_id),
                label: e.label_name,
                label_icon: e.label_icon
                // bg:require(`../../assets/labels/${e.label_name}.png`) ? require(`../../assets/labels/${e.label_name}.png`) : require(`../../assets/labels/Animals.png`)
            }
        });
        setLabelsList(data.data.item);
    }
    const selectCategory = (value: string) => {
        setInput({
            ...input,
            category: +value
        })
    }
    const handleOpenChange = (_v: boolean) => {
        if (input.chain !== '8007736') {
            return
        }
        setTokenPop(_v)
    }
    useEffect(() => {
        getCategory();
        getLabels();
    }, []);
    // const selectPop = (
    //     <div className="select-pop-content">
    //         <ul>
    //             {
    //                 labelsList.map((item: Op, index: number) => {
    //                     return (
    //                         <li key={index} className={`${labelsID.indexOf(+item.value) > -1 ? 'selected-label' : ''}`} onClick={() => {
    //                             const arr = labelsID;
    //                             const arrTe = labelsText;
    //                             arr.indexOf(+item.value) > -1 ? arr.splice(arr.indexOf(+item.value), 1) : arr.push(+item.value);
    //                             arrTe.indexOf(item.label) > -1 ? arrTe.splice(arrTe.indexOf(item.label), 1) : arrTe.push(item.label);
    //                             setLabelsID([...arr])
    //                             setLabelsText([...arrTe]);
    //                             setInput({
    //                                 ...input,
    //                                 labels: arr
    //                             })
    //                         }}>
    //                             <p>{item.label}</p>
    //                         </li>
    //                     )
    //                 })
    //             }
    //         </ul>
    //     </div>
    // )
    const selectTokenContent = () => {
        return (
            <div className="select-token-content">
                <p className="select-token-title">Select a token</p>
                {/* <div className="search-box">
                    <SearchOutlined />
                    <input type="text" placeholder="Search name or paste address" />
                </div> */}
                <div className="block-list">
                    <ul>
                        {
                            FilterAddressToName(input.chain).token.map((item: TokenMsg, index: number) => {
                                return (
                                    <li key={index} onClick={() => {
                                        setInput({
                                            ...input,
                                            token_info: item
                                        })
                                        setTokenPop(false)
                                    }}>
                                        <img src={item.icon} alt="" />
                                        <p>{item.symbol}</p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="inline-list">
                    <ul>
                        {
                            FilterAddressToName(input.chain).token.map((item: TokenMsg, index: number) => {
                                return (
                                    <li key={index} onClick={() => {
                                        setInput({
                                            ...input,
                                            token_info: item
                                        })
                                        setTokenPop(false)
                                    }}>
                                        <img src={item.icon} alt="" />
                                        <p>{item.symbol}</p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
    const inputBox = (
        <div className="input-box">
            <div className="public-inp-box">
                <p><sup>*</sup>Name</p>
                <input className="other-in" value={input.name} onChange={(e) => {
                    setInput({
                        ...input,
                        name: e.target.value
                    })
                }} type="text" placeholder="Please enter the name" />
            </div>
            <div className="public-inp-box">
                <p>Describtion(Optional)</p>
                <textarea placeholder="Please enter the describtion" value={input.desc} onChange={(e) => {
                    setInput({
                        ...input,
                        desc: e.target.value
                    })
                }}></textarea>
            </div>
            <div className="public-inp-box">
                <p><sup>*</sup>NFT Type</p>
                <Select
                    value={input.nft_type}
                    onChange={(val: string) => {
                        setInput({
                            ...input,
                            nft_type: val
                        })
                    }}
                    options={[
                        { value: '721', label: 'ERC721' },
                        { value: '40', label: 'BTC40' },
                    ]}
                />
            </div>
            <div className="public-inp-box">
                <p><sup>*</sup>Category</p>
                <Select
                    defaultValue="1"
                    onChange={selectCategory}
                    options={cateList}
                />
            </div>
            <div className="public-inp-box">
                <p><sup>*</sup>Labels</p>
                <div className="select-custom-box">
                    <div className="view-labels">
                        <ul>
                            {
                                labelsText.map((item: string, index: number) => {
                                    return (
                                        <li key={index} onClick={() => {
                                            const arr = labelsID;
                                            const arrTe = labelsText;
                                            arrTe.splice(arrTe.indexOf(item), 1)
                                            arr.splice(arrTe.indexOf(item), 1)
                                            setLabelsID([...arr])
                                            setLabelsText([...arrTe]);
                                            setInput({
                                                ...input,
                                                labels: arr
                                            })
                                        }}>
                                            <p>{item}</p>
                                            <p className="clear-label">
                                                <CloseOutlined />
                                            </p>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    {labelsText.length < 1 && <p className="label-placeholder">Select Label</p>}
                    {/* <DownOutlined /> */}
                </div>
            </div>
            <div className="select-pop-content">
                <ul>
                    {
                        labelsList.map((item: Op, index: number) => {
                            return (
                                <li key={index} className={`${labelsID.indexOf(+item.value) > -1 ? 'selected-label' : ''}`} onClick={() => {
                                    const arr = labelsID;
                                    const arrTe = labelsText;
                                    arr.indexOf(+item.value) > -1 ? arr.splice(arr.indexOf(+item.value), 1) : arr.push(+item.value);
                                    arrTe.indexOf(item.label) > -1 ? arrTe.splice(arrTe.indexOf(item.label), 1) : arrTe.push(item.label);
                                    setLabelsID([...arr])
                                    setLabelsText([...arrTe]);
                                    setInput({
                                        ...input,
                                        labels: arr
                                    })
                                }}>
                                    <p>{item.label}</p>
                                    <img src={item.label_icon} alt="" />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="public-inp-box">
                <p><sup>*</sup>Chain</p>
                <div className="select-chain-token">
                    <Select
                        defaultValue={state.chain as string}
                        onChange={selectChain}
                    >
                        {
                            NetworkConfig.map((item: Config) => {
                                return {
                                    value: item.chain_id,
                                    label: item.chain_name,
                                    logo: item.chain_logo,
                                    disabled: isDisable(item.chain_id)
                                }
                            }).map((item: { value: string, label: string, logo: string, disabled: boolean }, index: number) => {
                                return (
                                    <Select.Option key={index} value={item.value} disabled={item.disabled}>
                                        <div className="select-custom-option">
                                            <img src={item.logo} alt="" />
                                            <p>{item.label}</p>
                                        </div>
                                    </Select.Option>
                                )
                            })
                        }

                    </Select>
                    <Popover open={tokenPop} onOpenChange={handleOpenChange} rootClassName="custom-select-token-pop" content={selectTokenContent} title={null} placement="bottom" trigger={['click']}>
                        <div className="select-token">
                            <p>Asses</p>
                            <p>
                                <img src={input.token_info.icon} alt="" />
                                <span className="token-name">{input.token_info.symbol}
                                    <span className="sm">(Fees:<i>{Number(input.token_info.fee).toFixed(4)}</i>)</span>
                                </span>
                                {input.chain === '8007736' && <CaretDownOutlined />}
                            </p>
                        </div>
                    </Popover>
                </div>
            </div>
            <div className={`next-btn ${(!state.wallet || state.wallet === 'btc') ? 'disable-btn' : ''}`} onClick={() => {
                if (!state.wallet || state.wallet === 'btc') {
                    return
                }
                setActive(1);
            }}>
                <IconFont type="icon-jiantou" />
                <IconFont type="icon-jiantou" />
            </div>

        </div>
    )
    return (
        <div className="voice-nft-new-view">
            <div className="mask-box">
                <img src={require('../../assets/new/voice_nft_mask.png')} className="left-mask" alt="" />
                <img src={require('../../assets/new/voice_nft_mask.png')} className="right-mask" alt="" />
            </div>
            <div className={`view-inner ${active === 1 ? 'out-b' : ''}`}>
                <div className={`inner-w ${active === 1 ? 'm-w' : ''}`}>
                    <p className="page-icon">
                        <IconFont type="icon-create-2" />
                    </p>
                    <p className="page-title">Create</p>
                    {
                        !show
                            ? <div className="create-box">
                                <Button type="primary" onClick={() => {
                                    setShow(true);
                                }}>NEW NFT</Button>
                                <Button type="primary" onClick={() => {
                                    message.info('Coming soon')
                                }}>NEW COLLECTION</Button>
                            </div>
                            : <div>
                                <p className="page-step">
                                    Create&nbsp;{`>`}&nbsp;New NFTs&nbsp;{'>'}&nbsp;{`${active === 0 ? 'Information' : 'Design'}`}
                                </p>
                                <div className="step-box">
                                    <Button onClick={() => { setActive(0) }} className={`${active === 0 ? 'active-btn' : ''}`} type="default">Information</Button>
                                    <Button onClick={() => { setActive(1) }} className={`${active === 1 ? 'active-btn' : ''}`} type="default">Design</Button>
                                </div>
                                {
                                    active === 0
                                        ? inputBox
                                        : <DesignBox info={input} upDateBack={() => {
                                            setActive(0);
                                        }} />
                                }
                            </div>}
                </div>
                {/* <Button type="primary">Test Sign</Button> */}
            </div>
            <FooterNew />
        </div>
    )
};

export default VoiceNFTNewView;
