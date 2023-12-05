import { ReactElement, ReactNode, useContext } from "react";
import './index.scss'
import IconFont from "../../utils/icon";
import { PNft } from "../../App";

const URL: string = '/video/pizzap.aigc.s1.mp4'

const VideoView = (): ReactElement<ReactNode> => {
    const { state } = useContext(PNft);
    const shareTwitter = () => {
        // const metaArr = [
        //     'twitter:url', 'https://pizzap.io/#/video',
        //     'twitter:site', '@UIEg9fWlcPrvcMN',
        //     'twitter:creator', '@pizzap_io',
        //     'twitter:title', 'Videos in pizzap',
        //     'twitter:description', 'Pizzap is a user-benefit-oriented and mass-adopted AI ecosystem. Members  can create, show and trade NFTs in this community, as well as build personal art brand in MetaVerse.',
        //     'twitter:card', 'summary_large_image',
        //     'twitter:image', 'http://gg.chendahai.cn/static/image/pkq.jpg'
        // ]
        // const metaParams = metaArr.toString();
        window.open(`https://twitter.com/intent/tweet?refer_source=${encodeURIComponent(`https://pizzap.io/#/video`)}&text=${encodeURIComponent(`Pizzap Video`)}&via=pizzap_io&related=pizzap_io`)
    };
    const SignTest = async () => {
        const orderComponents = {
            Offerer: state.address,
            Offer: [
                {
                    ItemType: 2,
                    token: '0x169625caf5d3f14e8d9f680db6923343b80d1b1e',
                    IdentifierOrCriteria: 2,
                    StartAmount: 1,
                    EndAmount: 1
                }
            ],
            Consideration: [
                {
                    ItemType: 0,
                    token: '0x0000000000000000000000000000000000000000',
                    IdentifierOrCriteria: 2,
                    StartAmount: 97500000000000,
                    EndAmount: 97500000000000,
                    Recipient: state.address
                },
                {
                    ItemType: 0,
                    token: '0x0000000000000000000000000000000000000000',
                    IdentifierOrCriteria: 0,
                    StartAmount: 2500000000000,
                    EndAmount: 2500000000000,
                    Recipient: '0x0000a26b00c1f0df003000390027140000faa719'
                },
            ],
            StartTime: '1700620471',
            EndTime: '1700620471',
            OrderType: 0,
            Zone: '0x0000000000000000000000000000000000000000',
            ZoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            Salt: '24446860302761739304752683030156737591518664810215442929806304066879115155323',
            ConduitKey: '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
            Counter: 0
        };
        const domain = {
            name: "Pizzap",
            version: "1.0",
            chainId: 10, // Ethereum mainnet
            verifyingContract: "0x1E0049783F008A0085193E00003D00cd54003c71", // Replace with the actual smart contract address
        };
        const message = {
            ...orderComponents,
            ...domain,
        };
        const types = {
            OrderComponents: [
                { name: "Offerer", type: "address" },
                { name: "Offer", type: "Offer[]" },
                { name: "Consideration", type: "Conside[]" },
                { name: "StartTime", type: "string" },
                { name: "EndTime", type: "string" },
                { name: "OrderType", type: "uint256" },
                { name: "Zone", type: "address" },
                { name: "ZoneHash", type: "string" },
                { name: "Salt", type: "string" },
                { name: "ConduitKey", type: "string" },
                { name: "Counter", type: "uint256" },
            ],
            Offer: [
                { name: 'ItemType', type: 'uint256' },
                { name: 'Token', type: 'address' },
                { name: 'IdentifierOrCriteria', type: 'uint256' },
                { name: 'StartAmount', type: 'uint256' },
                { name: 'EndAmount', type: 'uint256' }
            ],
            Conside: [
                { name: 'ItemType', type: 'uint256' },
                { name: 'Token', type: 'address' },
                { name: 'IdentifierOrCriteria', type: 'uint256' },
                { name: 'StartAmount', type: 'uint256' },
                { name: 'EndAmount', type: 'uint256' },
                { name: 'Recipient', type: 'address' }
            ]
        };
        const data = {
            types: types,
            domain: domain,
            primaryType: "OrderComponents",
            message: message,
        };

        const encoder = new TextEncoder();
        const encodedData = encoder.encode(JSON.stringify(data));
        console.log(encodedData)
        const hash = await state.ethereum.request({
            method: "eth_signTypedData_v4",
            params: [state.address, JSON.stringify(data)],
        });
        console.log(hash)
    }
    return (
        <div className="video-view">
            <div className="view-inner">
                <video controls>
                    <source src={URL} type="video/mp4" />
                </video>
                <div className="share-box">
                    <p>Share to</p>
                    <p>
                        <IconFont type="icon-twitter-logo-bold" onClick={shareTwitter} />
                        <IconFont type="icon-telegram-logo-bold" onClick={() => {
                            window.open(`https://t.me/share/url?url=${encodeURIComponent('https://pizzap.io/#/video')}&text=${encodeURIComponent('Videos in Pizzap')}`)
                        }} />
                        <IconFont type="icon-discord-logo-bold" onClick={SignTest}/>
                    </p>
                </div>
            </div>
        </div>
    )
};

export default VideoView;