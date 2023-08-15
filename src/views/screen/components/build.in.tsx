import { ReactElement, ReactNode } from "react";

interface List {
    title: string,
    color: string,
    text: string,
    bg: string
}

const BuildIN = (): ReactElement<ReactNode> => {
    const list: List[] = [
        {
            title: 'AI',
            color: '',
            text: 'AI-generated creations will soon become the primary production mode of Web3,and the creation trends in Pizzap will gradually shift towards AIGC.',
            bg: require('../../../assets/images/build_card_bg_1.png'),
        },
        {
            title: 'AIGC',
            color: '',
            text: 'Pizzap supports the listing of any AIGC work, including but not limited to land, PFP,and domain names.',
            bg: require('../../../assets/images/build_card_bg_2.png'),
        },
        {
            title: 'AIRDROPS',
            color: '',
            text: 'Holders of $PI will receive regular AIGC NFT airdrops from Pizzap Official.',
            bg: require('../../../assets/images/build_card_bg_3.png'),
        }
    ]
    return (
        <div className="build-index public-screen">
            <p className="build-title public-title">AI BUIDLING IN PIZZAP</p>
            <ul className="build-list">
                {
                    list.map((item: List, index: number): ReactElement => {
                        return (
                            <li key={index}>
                                <div className="bg-box">
                                    <img src={item.bg} alt="" />
                                </div>
                                <p>{item.title}</p>
                                <p>{item.text}</p>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
};

export default BuildIN;