import { ReactElement, ReactNode } from "react";
import IconFont from "../../../utils/icon";


interface In {
    icon: string,
    title: string,
    text: string,
    color: string,
    icon_color:string
}
const Inlist: In[] = [
    {
        icon: 'icon-a-AIIcons-24',
        title: 'AI',
        text: 'AI-generated creations will soon become the primary production mode of Web3,and the creation trends in Pizzap will gradually shift towards AIGC.',
        color: '#FEEDD1',
        icon_color:'#C8851D',
    },
    {
        icon: 'icon-a-AIIcons-13',
        title: 'AIGC',
        text: 'Pizzap supports the listing of any AIGC work, including but not limited to land, PFP,and domain names.',
        color: '#ABF0FF',
        icon_color:'#299CB6',
    },
    {
        icon: 'icon-a-AIIcons-20',
        title: 'Airdrops',
        text: 'Holders of $PI will receive regular AIGC NFT airdrops from Pizzap Official.',
        color: '#D6D5FF',
        icon_color:'#5A5AC8',
    },
]
const BuildInNew = (): ReactElement<ReactNode> => {
    return (
        <div className="build-in-new">
            <p className="build-title public-title">
                <span>AI Building</span>&nbsp;
                in Pizzap
            </p>
            <ul>
                {
                    Inlist.map((item: In, index: number) => {
                        return (
                            <li key={index} style={{ background: item.color }}>
                                <div className="icon-box">
                                    <IconFont type={item.icon} style={{color:item.icon_color}}/>
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

export default BuildInNew;