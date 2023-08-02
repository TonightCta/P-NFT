import { ReactElement, ReactNode } from "react";
import FooterWapper from "../../../components/footer";

interface List {
    title: string,
    color: string,
    text: string
}

const BuildIN = (): ReactElement<ReactNode> => {
    const list: List[] = [
        {
            title: 'AI',
            color: '',
            text: 'AI-generated creations will soon become the primary production mode of Web3,and the creation trends in Pizzap will gradually shift towards AIGC.'
        },
        {
            title: 'AIGC',
            color: '',
            text: 'Pizzap supports the listing of any AIGC work, including but not limited to land, PFP,and domain names.'
        },
        {
            title: 'AIRDROPS',
            color: '',
            text: 'Holders of $PI will receive regular AIGC NFT airdrops from Pizzap Official.'
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
                                <p>{item.title}</p>
                                <p>{item.text}</p>
                            </li>
                        )
                    })
                }
            </ul>
            <FooterWapper/>
        </div>
    )
};

export default BuildIN;