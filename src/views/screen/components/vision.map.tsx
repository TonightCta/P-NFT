import { ReactElement, ReactNode } from "react";


interface List {
    img: string,
    title: string,
    text: string
}

const VisionMap = (): ReactElement<ReactNode> => {
    const list: List[] = [
        {
            img: require('../../../assets/images/map_1.png'),
            title: 'MultiVerse',
            text: 'We are now building a multi-chain NFT platform that supports NFT trading.'
        },

        {
            img: require('../../../assets/images/map_3.png'),
            title: 'Owners Gallery',
            text: 'VoiceNFT owners will create digital works for sale on Pizzap.'
        },
    ];
    const list_2: List[] = [
        {
            img: require('../../../assets/images/map_2.png'),
            title: 'Voice Training',
            text: 'We will provide voice training services based on speech intelligence.'
        },
        {
            img: require('../../../assets/images/map_4.png'),
            title: 'AIGC Artwork Collections',
            text: 'We will showcase the value of machine-generated creations at the AIGC track,and unlock the commercial potential of the AIGC Collection.'
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
                                        <div className="img-box">
                                            <img src={item.img} alt="" />
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
                    <ul className="voice-list" style={{paddingTop:'80px'}}>
                        {
                            list_2.map((item: List, index: number): ReactElement => {
                                return (
                                    <li key={index}>
                                        <div className="img-box">
                                            <img src={item.img} alt="" />
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
                </div>
            </div>
            <div className="text-bg">
                <img src={require('../../../assets/images/screen_3_text.png')} alt="" />
            </div>
        </div>
    )
};

export default VisionMap;