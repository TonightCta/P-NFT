import { ReactElement, ReactNode } from "react";
import './index.scss'
import TopScreen from "./components/top.screen";
import ShowContent from "./components/show.content";
import FooterNew from "../screen.new/components/footer.new";

const GalleryView = (): ReactElement<ReactNode> => {
    return (
        <div className="gallery-view">
            <TopScreen/>
            <ShowContent/>
            <FooterNew/>
        </div>
    )
};

export default GalleryView;