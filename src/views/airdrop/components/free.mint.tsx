import { Button } from "antd";
import { ReactElement } from "react";

interface Mint {
    title: string,
    text: string
}
const MintRemark: Mint[] = [
    {
        title: 'Activity Rules:',
        text: 'During the event, new users will receive SBT NFT upon login. Holding SBT NFT will entitle users to various benefits and discounts provided by the pizzap platform.'
    },
    {
        title: 'Quantity of activity:',
        text: 'The event is limited to 50,000 participants only.'
    }
]

const FreeMintCard = (): ReactElement => {
    return (
        <div className="free-mint-card">
            <ul>
                {
                    MintRemark.map((item: Mint, index: number): ReactElement => {
                        return (
                            <li key={index}>
                                <p>{item.title}</p>
                                <p>{item.text}</p>
                            </li>
                        )
                    })
                }
            </ul>
            <div className="oper-btns">
                <p>
                    <Button type="primary">
                        MINT
                    </Button>
                </p>
                <p>Your unclaimed PI: 10</p>
            </div>
        </div>
    )
};

export default FreeMintCard;