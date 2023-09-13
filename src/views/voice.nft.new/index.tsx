import { ReactElement, ReactNode, useState } from "react";
import './index.scss'
import FooterNew from "../screen.new/components/footer.new";
import IconFont from "../../utils/icon";
import { Button, Select } from "antd";
// import InputBox from "./components/input.box";
import DesignBox from "./components/design.box";

const VoiceNFTNewView = (): ReactElement<ReactNode> => {
    const [active, setActive] = useState<number>(0);
    const [show, setShow] = useState<boolean>(false);
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };
    const InputBox = () => {
        return (
            <div className="input-box">
                <div className="public-inp-box">
                    <p><sup>*</sup>Name</p>
                    <input className="other-in" type="text" placeholder="Please enter the name" />
                </div>
                <div className="public-inp-box">
                    <p>Describtion(Optional)</p>
                    <textarea placeholder="Please enter the describtion"></textarea>
                </div>
                <div className="public-inp-box">
                    <p><sup>*</sup>NFT Type</p>
                    <Select
                        defaultValue="lucy"
                        onChange={handleChange}
                        options={[
                            { value: 'jack', label: 'Jack' },
                            { value: 'lucy', label: 'Lucy' },
                            { value: 'Yiminghe', label: 'yiminghe' },
                            { value: 'disabled', label: 'Disabled', disabled: true },
                        ]}
                    />
                </div>
                <div className="public-inp-box">
                    <p><sup>*</sup>Category</p>
                    <Select
                        defaultValue="lucy"
                        onChange={handleChange}
                        options={[
                            { value: 'jack', label: 'Jack' },
                            { value: 'lucy', label: 'Lucy' },
                            { value: 'Yiminghe', label: 'yiminghe' },
                            { value: 'disabled', label: 'Disabled', disabled: true },
                        ]}
                    />
                </div>
                <div className="public-inp-box">
                    <p><sup>*</sup>Labels</p>
                    <Select
                        defaultValue="lucy"
                        mode="multiple"
                        onChange={handleChange}
                        options={[
                            { value: 'jack', label: 'Jack' },
                            { value: 'lucy', label: 'Lucy' },
                            { value: 'Yiminghe', label: 'yiminghe' },
                            { value: 'disabled', label: 'Disabled', disabled: true },
                        ]}
                    />
                </div>
                <div className="public-inp-box">
                    <p><sup>*</sup>Chain</p>
                    <Select
                        defaultValue="lucy"
                        onChange={handleChange}
                        options={[
                            { value: 'jack', label: 'Jack' },
                            { value: 'lucy', label: 'Lucy' },
                            { value: 'Yiminghe', label: 'yiminghe' },
                            { value: 'disabled', label: 'Disabled', disabled: true },
                        ]}
                    />
                </div>
                <div className="next-btn" onClick={() => {
                    setActive(1);
                }}>
                    <img src={require('../../assets/new/next_right.png')} alt="" />
                </div>
            </div>
        )
    }
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
                                <Button type="primary">NEW COLLECTION</Button>
                            </div>
                            : <div>
                                <p className="page-step">
                                    Create{`>`}New NFTs{'>'}{`${active === 0 ? 'Information' : 'Design'}`}
                                </p>
                                <div className="step-box">
                                    <Button onClick={() => { setActive(0) }} className={`${active === 0 ? 'active-btn' : ''}`} type="default">Information</Button>
                                    <Button onClick={() => { setActive(1) }} className={`${active === 1 ? 'active-btn' : ''}`} type="default">Design</Button>
                                </div>
                                {
                                    active === 0
                                        ? <InputBox />
                                        : <DesignBox upDateBack={() => {
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