import { ReactElement, useEffect, useState } from "react";
import { Token } from "..";
import { Drawer, Spin } from "antd";

interface Props {
  visible: boolean;
  tokenList: Token[];
  loading:boolean,
  upToken: (token: Token) => void;
  onClose: (value: boolean) => void;
}

const MobilePoolDrawer = (props: Props): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  useEffect(() => {
    props.visible && setVisible(props.visible);
  }, [props.visible]);
  return (
    <Drawer
      title={null}
      placement="left"
      width="60%"
      closeIcon={null}
      onClose={() => {
        setVisible(false);
        props.onClose(false);
      }}
      open={visible}
    >
      <div className="mobile-drawer-pool">
        <div className="token-list-swap">
          <p className="list-name">New Memes Pool</p>
          <ul>
            {props.tokenList.map((item: Token, index: number) => {
              return (
                <li
                  key={index}
                  onClick={() => {
                    props.upToken(item);
                    setVisible(false);
                    props.onClose(false);
                  }}
                >
                  <img src={item.logo_url} alt="" />
                  <div className="token-info">
                    <p>{item.currency_name}</p>
                    <p>
                      {item.currency_address.substring(0, 6)}...
                      {item.currency_address.substring(
                        item.currency_address.length - 6,
                        item.currency_address.length
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          {props.loading && (
            <div className="loading-box">
              <Spin size="large" />
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default MobilePoolDrawer;
