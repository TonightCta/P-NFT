import { ReactElement, ReactNode } from "react";
import './index.scss'
import CollectionCard from "./components/collection.card";
import CreatorCard from "./components/creator.card";
import DiscoverList from "./components/discover.list";
import FooterNew from "../screen.new/components/footer.new";

const MarketPlaceViewNew = (): ReactElement<ReactNode> => {
    return (
        <div className="market-place-view-new">
            <CollectionCard />
            <CreatorCard />
            {/* <TopworkCard /> */}
            <DiscoverList />
            <FooterNew />
        </div>
    )
};


export default MarketPlaceViewNew;