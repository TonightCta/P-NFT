import { ReactElement } from "react";

interface Props {
    type: number,
    data: unknown
}

const WorkList = (props: Props): ReactElement => {
    return (
        <div className="work-list">
            <div className="list-title">
                <p>Rank</p>
                <p>Collection</p>
                <p>Floor Price</p>
                <p>Volume</p>
            </div>
            {
                [1, 2, 3, 4, 5].map((item: number, index: number) => {
                    return (
                        <div className="list-inner" key={index}>
                            <p>{index + (props.type === 1 ? 1 : 6)}</p>
                            <div className="collection-msg">
                                <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                                <p>Alex</p>
                            </div>
                            <p>0.002&nbsp;ETH</p>
                            <div className="price-msg">
                                <p>22&nbsp;ETH</p>
                                <p>+88%</p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
};

export default WorkList;