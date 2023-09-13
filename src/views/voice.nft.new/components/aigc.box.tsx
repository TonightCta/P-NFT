import { ReactElement, useState } from "react";
import IconFont from "../../../utils/icon";
import { Button, Select, Slider } from "antd";
import type { SliderMarks } from 'antd/es/slider';

interface Coll {
    title: string,
    list: string[]
}

interface Word {
    title: string,
    coll: Coll[]
}

const marks: SliderMarks = {
    100: 'Slow',
    200: 'Fast',
};
const WordList: Word[] = [
    {
        title: 'Commonly used',
        coll: [
            {
                title: 'Image optimization',
                list: ['1', '2', '3', '4']
            },
            {
                title: 'Camera angle',
                list: ['5', '6', '7', '8']
            },
            {
                title: 'Other commonly used',
                list: ['9', '10', '11', '12']
            }
        ],
    },
    {
        title: 'Figure',
        coll: [
            {
                title: 'Image optimization',
                list: ['Masterpiece', 'Best quality', '8k Resolution', 'Offical art']
            },
            {
                title: 'Camera angle',
                list: ['Depth of filed', 'best quality', '8k resolution', 'offical art']
            },
            {
                title: 'Other commonly used',
                list: ['Depth of filed 123123']
            }
        ],
    },
    {
        title: 'Facial features',
        coll: [
            {
                title: 'Image optimization',
                list: ['Masterpiece', 'Best quality', '8k Resolution', 'Offical art']
            },
            {
                title: 'Camera angle',
                list: ['Depth of filed', 'best quality', '8k resolution', 'offical art']
            },
            {
                title: 'Other commonly used',
                list: ['Depth of filed']
            }
        ],
    },
    {
        title: 'Hair',
        coll: [
            {
                title: 'Image optimization',
                list: ['Masterpiece', 'Best quality', '8k Resolution', 'Offical art']
            },
            {
                title: 'Camera angle',
                list: ['Depth of filed', 'best quality', '8k resolution', 'offical art']
            },
            {
                title: 'Other commonly used',
                list: ['Depth of filed']
            }
        ],
    },
    {
        title: 'Clothing',
        coll: [
            {
                title: 'Image optimization',
                list: ['Masterpiece', 'Best quality', '8k Resolution', 'Offical art']
            },
            {
                title: 'Camera angle',
                list: ['Depth of filed', 'best quality', '8k resolution', 'offical art']
            },
            {
                title: 'Other commonly used',
                list: ['Depth of filed']
            }
        ],
    },
    {
        title: 'Style',
        coll: [
            {
                title: 'Image optimization',
                list: ['Masterpiece', 'Best quality', '8k Resolution', 'Offical art']
            },
            {
                title: 'Camera angle',
                list: ['Depth of filed', 'best quality', '8k resolution', 'offical art']
            },
            {
                title: 'Other commonly used',
                list: ['Depth of filed']
            }
        ],
    },
]

const AigcBox = (): ReactElement => {
    const [active, setActive] = useState<number>(0);
    const [collList, setCollList] = useState<Coll[]>(WordList[0].coll);
    const [wordListS, setWordList] = useState<string[]>([]);
    const [rate, setRate] = useState<number>(100);
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };
    return (
        <div className="aigc-box">
            <div className="img-create-box public-create-box">
                <p className="create-title">
                    <IconFont type="icon-tupian" />
                    <sup>*</sup>
                    Vocabulary generator
                </p>
                <div className="word-box">
                    <div className="left-word">
                        <ul className="top-tabs">
                            {
                                WordList.map((item: Word, index: number) => {
                                    return (
                                        <li key={index} className={`${active === index ? 'active-tab' : ''}`} onClick={() => {
                                            setActive(index);
                                            setCollList(item.coll)
                                        }}>{item.title}</li>
                                    )
                                })
                            }
                        </ul>
                        {
                            collList.map((item: Coll, index: number) => {
                                return (
                                    <div className="word-o" key={index}>
                                        <p className="o-title">{item.title}</p>
                                        <ul className="word-list">
                                            {
                                                item.list.map((e: string, i: number) => {
                                                    return (
                                                        <li key={`${i}-${new Date().getTime()}`} className={`${(wordListS.indexOf(e) > -1) ? 'select-word' : ''}`} onClick={() => {
                                                            const arr = wordListS;
                                                            arr.indexOf(e) > -1 ? arr.splice(arr.indexOf(e), 1) : arr.push(e);
                                                            setWordList([...arr])
                                                        }}>
                                                            <p>{e}</p>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="right-view">
                        <div className="prompts-box">
                            <p>
                                <sup>*</sup>
                                Prompts
                            </p>
                            <div className="review">
                                <p>{wordListS.join(',')}</p>
                            </div>
                        </div>
                        <div className="preview-box">
                            <p>
                                Preview
                            </p>
                            <div className="review"></div>
                        </div>
                        <p className="generate-btn">
                            <Button className={`${wordListS.length < 1 ? 'dis-btn' : ''}`} disabled={wordListS.length < 1} type="primary">Generate image</Button>
                        </p>
                    </div>
                </div>
            </div>
            <div className="audio-create-box public-create-box">
                <p className="create-title">
                    <IconFont type="icon-yinpin" />
                    Audio
                </p>
                <div className="public-audio-inp">
                    <p><sup>*</sup>Text</p>
                    <textarea placeholder="Please enter the text"></textarea>
                </div>
                <div className="public-audio-inp">
                    <p><sup>*</sup>Speed</p>
                    <div className="progress">
                        <Slider marks={marks} min={100} max={200} onChange={(value) => {
                            setRate(value);
                        }} />
                    </div>
                </div>
                <div className="public-audio-inp" style={{marginTop:'48px'}}>
                    <p><sup>*</sup>Model</p>
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
                <div className="public-audio-inp">
                    <p><sup>*</sup>Review</p>
                    <audio controls />
                </div>
                <p className="generate-btn">
                    <Button type="primary">Generate Voice</Button>
                </p>
            </div>
            <p className="confirm-btn">
                <Button type="primary">Confirm and Mint</Button>
            </p>
        </div>
    )
};

export default AigcBox;