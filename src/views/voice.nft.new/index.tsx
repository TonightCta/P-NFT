import { ReactElement, ReactNode, useEffect, useState } from "react";
import './index.scss'
import FooterNew from "../screen.new/components/footer.new";
import IconFont from "../../utils/icon";
import { Button, Select, message } from "antd";
import DesignBox from "./components/design.box";
import { CategoryList, LabelList } from "../../request/api";
import { CloseOutlined } from "@ant-design/icons";
import { Config, NetworkConfig } from "../../utils/source";

interface Op {
    value: string | number,
    label: string,
    label_icon: string,
    bg?: string
}

export interface Input {
    name: string,
    desc: string,
    category: number,
    chain: string,
    labels: number[]
}

const VoiceNFTNewView = (): ReactElement<ReactNode> => {
    const [active, setActive] = useState<number>(0);
    const [show, setShow] = useState<boolean>(false);
    const [cateList, setCateList] = useState<Op[]>([]);
    const [labelsList, setLabelsList] = useState<Op[]>([]);
    const [labelsID, setLabelsID] = useState<number[]>([]);
    const [labelsText, setLabelsText] = useState<string[]>([]);
    const [input, setInput] = useState<Input>({
        name: '',
        desc: '',
        category: 1,
        chain: '8007736',
        labels: []
    })
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
    const selectChain = (e: unknown) => {
        setInput({
            ...input,
            chain: String(e)
        })
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
    useEffect(() => {
        getCategory();
        getLabels();
    }, []);
    const selectPop = (
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
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
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
                    defaultValue="721"
                    options={[
                        { value: '721', label: 'ERC721' },
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
                <Select
                    defaultValue="8007736"
                    onChange={selectChain}
                >
                    {
                        NetworkConfig.map((item: Config) => {
                            return {
                                value: item.chain_id,
                                label: item.chain_name,
                                logo: item.chain_logo,
                                disabled: item.chain_id !== '8007736' && item.chain_id !== '314' && item.chain_id !== '10' && item.chain_id !== '210425'
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
            </div>
            <div className="next-btn" onClick={() => {
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
