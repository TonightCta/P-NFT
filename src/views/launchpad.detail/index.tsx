import { ReactElement, ReactNode } from "react";
import "./index.scss";
import FooterNew from "../screen.new/components/footer.new";
import IconFont from "../../utils/icon";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const LaunchpadDetailView = (): ReactElement<ReactNode> => {
  const navigate = useNavigate();
  return (
    <div className="launchpad-detail-view">
      <div className="detail-inner">
        <div className="poster-box">
          <img src={require("../../assets/images/test2.png")} alt="" />
        </div>
        <div className="collection-msg">
          <div className="col-n-b">
            <IconFont type="icon-fanhuijiantou" onClick={() => {
                navigate('/launchpad')
            }}/>
            <img src={require("../../assets/images/test2.png")} alt="" />
            <p>Launchpad</p>
          </div>
          <p className="col-name">Babybunny MINT</p>
          <div className="creator-msg">
            <img src={require("../../assets/images/test2.png")} alt="" />
            <div className="c-by">
              <p>Created by ABC</p>
              <p>35&nbsp;NFTs</p>
            </div>
          </div>
          <div className="mint-box">
            <div className="price-total">
              <div className="price total-public">
                <p>Mint Price</p>
                <p>
                  <img
                    src={require("../../assets/images/eth.logo.2.png")}
                    alt=""
                  />
                  2.525
                </p>
              </div>
              <div className="total-public">
                <p>Tokens Minted</p>
                <p>0/120</p>
              </div>
            </div>
            <div className="mint-oper">
              <Button type="primary">Mint Closed</Button>
            </div>
          </div>
          <div className="desc-box">
            <p className="desc-title">
              <IconFont type="icon-detail" />
              Description
            </p>
            <p className="desc-text">
              PAI Space is a collection of Pizzap AI Creating, co-owned and
              managed by PizzapDAO Members. Creators should use Pizzap AI
              creating tools to create, which currently support the creation of
              pictures, copywriting, and voice.
            </p>
          </div>
        </div>
      </div>
      <FooterNew />
    </div>
  );
};

export default LaunchpadDetailView;
