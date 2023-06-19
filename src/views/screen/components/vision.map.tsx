import { ReactElement, ReactNode } from "react";
import FooterWapper from "../../../components/footer";


interface List {
    img: string | ImageData,
    title: string,
    text: string
}

const VisionMap = (): ReactElement<ReactNode> => {
    const list: List[] = [
        {
            img: '',
            title: 'MultiVerse',
            text: 'We are now building a multi-chain NFT platform that supports NFT trading.'
        },
        {
            img: '',
            title: 'Voice Training',
            text: 'We will provide voice training services based on speech intelligence.'
        },
        {
            img: '',
            title: 'Owners Gallery',
            text: 'VoiceNFT owners will create digital works for sale on Pizzap.'
        },
        {
            img: '',
            title: 'AIGC Artwork Collections',
            text: 'We will showcase the value of machine-generated creations at the AIGC track,and unlock the commercial potential of the AIGC Collection.'
        },
    ]
    return (
        <div className="vision-map public-screen">
            <p className="public-title">VISIONMAP OF PIZZAP</p>
            <ul className="voice-list">
                {
                    list.map((item: List, index: number): ReactElement => {
                        return (
                            <li key={index}>
                                <div className="img-box">
                                    <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                                </div>
                                <div className="text-box">
                                    <p>{item.title}</p>
                                    <p>{item.text}</p>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
            <FooterWapper/>
        </div>
    )
};

export default VisionMap;