import { ReactElement, ReactNode, useEffect, useState } from "react";
import './index.scss'
import FooterNew from "../screen.new/components/footer.new";
import IconFont from "../../utils/icon";
import { Button, Select, message } from "antd";
// import InputBox from "./components/input.box";
import DesignBox from "./components/design.box";
import { CategoryList, LabelList } from "../../request/api";

interface Op {
    value: string | number,
    label: string
}

export interface Input {
    name: string,
    desc: string,
    category: number,
    labels: number[]
}

const VoiceNFTNewView = (): ReactElement<ReactNode> => {
    const [active, setActive] = useState<number>(0);
    const [show, setShow] = useState<boolean>(false);
    const [cateList, setCateList] = useState<Op[]>([]);
    const [labelsList, setLabelsList] = useState<Op[]>([]);
    const [input, setInput] = useState<Input>({
        name: '',
        desc: '',
        category: 1,
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
    const getLabels = async () => {
        const result = await LabelList({
            page_size: 100
        })
        const { data } = result;
        data.data.item = data.data.item.map((e: { label_id: number, label_name: string }) => {
            return {
                value: String(e.label_id),
                label: e.label_name
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
    const selectLabel = (value: string[]) => {
        setInput({
            ...input,
            labels: value.map(Number)
        })
    };
    useEffect(() => {
        getCategory();
        getLabels();
    }, [])
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
                <Select
                    mode="multiple"
                    onChange={selectLabel}
                    placeholder="Select label"
                    options={labelsList}
                />
            </div>
            <div className="public-inp-box">
                <p><sup>*</sup>Chain</p>
                <Select
                    defaultValue="plian"
                    options={[
                        { value: 'plian', label: 'Plian' },
                    ]}
                />
            </div>
            <div className="next-btn" onClick={() => {
                setActive(1);
            }}>
                <IconFont type="icon-jiantou"/>
                <IconFont type="icon-jiantou"/>
            </div>
        </div>
    )
    return (
        <div className="voice-nft-new-view">
            <div className="mask-box">
                <img src={require('../../assets/new/voice_nft_mask.png')} className="left-mask" alt="" />
                <img src={require('../../assets/new/voice_nft_mask.png')} className="right-mask" alt="" />
            </div>
            <div className="view-inner">
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
            </div>
            <FooterNew />
        </div>
    )
};

export default VoiceNFTNewView;
