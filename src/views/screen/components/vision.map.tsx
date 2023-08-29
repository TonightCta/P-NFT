import { ReactElement, ReactNode } from "react";
import IconFont from "../../../utils/icon";


interface List {
    title: string,
    text: string,
    color: string,
    icon: string
}

const VisionMap = (): ReactElement<ReactNode> => {
    const list: List[] = [
        {
            title: 'MultiVerse',
            text: 'We are now building a multi-chain NFT platform that supports NFT trading.',
            color: 'linear-gradient(135deg, #FA3370 0%, #FA89CB 100%)',
            icon: 'icon-a-AIIcons-15'
        },

        {
            title: 'Owners Gallery',
            text: 'VoiceNFT owners will create digital works for sale on Pizzap.',
            icon: 'icon-a-AIIcons-7',
            color: 'linear-gradient(135deg, #5C34FF 0%, #7070FF 100%)'
        },
    ];
    const list_2: List[] = [
        {
            title: 'Voice Training',
            text: 'We will provide voice training services based on speech intelligence.',
            icon: 'icon-a-AIIcons-22',
            color: 'linear-gradient(135deg, #5C34FF 0%, #7070FF 100%)'
        },
        {
            title: 'AIGC Artwork Collections',
            text: 'We will showcase the value of machine-generated creations at the AIGC track,and unlock the commercial potential of the AIGC Collection.',
            icon: 'icon-a-AIIcons-1',
            color: 'linear-gradient(135deg, #FA3370 0%, #FA89CB 100%)'
        },
    ]
    return (
        <div className="vision-map public-screen">
            <div className="map-inner">
                <div className="list-inner">
                    <ul className="voice-list">
                        {
                            list.map((item: List, index: number): ReactElement => {
                                return (
                                    <li key={index}>
                                        <div className="img-box" style={{background:item.color}}>
                                            <IconFont type={item.icon} />
                                        </div>
                                        <div className="text-box">
                                            {/* <p>{item.title}</p> */}
                                            <p>{item.text}</p>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <ul className="voice-list need-top-8">
                        {
                            list_2.map((item: List, index: number): ReactElement => {
                                return (
                                    <li key={index}> 
                                        <div className="img-box" style={{background:item.color}}>
                                            <IconFont type={item.icon} />
                                        </div>
                                        <div className="text-box">
                                            {/* <p>{item.title}</p> */}
                                            <p>{item.text}</p>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="title-msg">
                    <div className="title-box">
                        <p className="public-title">VISIONMAP OF</p>
                        <p className="public-title">PIZZAP</p>
                    </div>
                    <div className="img-box">
                        <img src={require('../../../assets/images/map_icon_1.png')} alt="" />
                    </div>
                </div>
            </div>
            <div className="text-bg">
                <img src={require('../../../assets/images/screen_3_text.png')} alt="" />
            </div>
        </div>
    )
};

export default VisionMap;