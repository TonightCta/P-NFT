import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { Button } from "antd";
import './index.scss'
import { useMetamask } from "../../utils/metamask";
import { PNft } from "../../App";
import { useHiro } from "../../utils/hiro";
import { useXVerse } from "../../utils/xverse";
import FixedTabIndex from "./components/fixed.tab";
import Sketch from "./tool/sketch";

const ScreenView = (): ReactElement<ReactNode> => {
    const { connectMetamask } = useMetamask();
    const { state } = useContext(PNft);
    const { connectHiro } = useHiro();
    const { connectXVerse } = useXVerse();
    const [metaAddress, setMetaAddress] = useState<string | null>();
    const [canvasEle, setCanvasEle]: Array<any> = useState(null)
    useEffect(() => {
        setMetaAddress(state.address)
    }, [state.address])
    useEffect(() => {
        const rel = document.getElementById('container')
        if (rel && !canvasEle?.container) {
            const ele = new Sketch({
                dom: document.getElementById('container'),
            })
            // ele.stop()
            setCanvasEle(ele)
        }
    }, [])
    return (
        <div className="screen-view">
            <FixedTabIndex />
            <section className="canvas-box" id="container">

            </section>
            <div>
                <Button type="primary" size="large" onClick={async () => {
                    await connectMetamask();
                }}>Metamask</Button>
                <p>{metaAddress}</p>
            </div>
            <div>
                <Button type="primary" size="large" onClick={() => {
                    connectHiro()
                }}>Hiro Wallet</Button>
                <p>{metaAddress}</p>
            </div>
            <div>
                <Button type="primary" size="large" onClick={() => {
                    console.log(canvasEle)
                    canvasEle.play()
                }}>Xverse Wallet</Button>
                <p>{metaAddress}</p>
            </div>
        </div>
    )
};

export default ScreenView;