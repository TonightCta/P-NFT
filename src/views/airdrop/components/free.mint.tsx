import { Button } from "antd";
import { ReactElement, useEffect, useState } from "react";
import { useContract } from "../../../utils/contract";

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
    const { queryMint,claimMint } = useContract();
    const [mint, setMint] = useState<number>(0);
    const [wait, setWait] = useState<boolean>(false);
    const queryFN = async () => {
        const result = await queryMint();
        setMint(+result);
    };
    const mintFN = async () => {
        setWait(true);
        const result: any = await claimMint();
        setWait(false);
        if (!result || result.message) {
            return
        };
    }
    useEffect(() => {
        queryFN()
    }, [])
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
                    <Button loading={wait} disabled={mint > 0 || wait} type="primary" onClick={mint > 0 ? () => {} : mintFN}>
                        {mint > 0 ? 'ALREADY MINTED' : 'MINT'}
                    </Button>
                </p>
            </div>
        </div>
    )
};

export default FreeMintCard;