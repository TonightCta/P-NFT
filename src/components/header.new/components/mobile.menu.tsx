import { Button, Drawer, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { Menu, MenuList } from "..";
import { PoweroffOutlined } from "@ant-design/icons";
import { PNft } from "../../../App";
import { useNavigate } from "react-router-dom";
import { Type } from "../../../utils/types";

interface Props {
  visible: boolean,
  closeDraw: (val: boolean) => void
}
const TokenMenu: Menu[] = [
  {
    name: 'My NFTs',
    url: '/user/:address',
  },
  {
    name: 'Setting',
    url: '/profile'
  }
]

const MobileMenu: Menu[] = [
  {
    name: 'Inscribe',
    url: '/inscribe'
  },
  // {
  //   name: 'Collection',
  //   url: '/ins-collection'
  // },
  {
    name: 'Create',
    url: '/create',
  },
  {
    name: 'Collections',
    url: '/collections',
  },
  {
    name: 'Memes',
    url: '/memes',
  },
  {
    name: 'AI Campaigns',
    url: '/campaigns',
  },
  {
    name: 'Airdrops',
    url: '/airdrop',
  },
  {
    name: 'FAQ',
    url: 'https://forms.gle/LDzXJgQhQ3Ety4kT8'
  }
]


const MobileMenuDraw = (props: Props): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const { state, dispatch } = useContext(PNft);
  const navigate = useNavigate();
  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible])
  const onClose = () => {
    setVisible(false);
    props.closeDraw(false)
  }
  return (
    <Drawer width={260} title={null} placement="right" onClose={onClose} open={visible}>
      <div className="mobile-menu">
        <div className="menu-box">
          <ul>
            {
              MobileMenu.map((item: Menu, index: number) => {
                return (
                  <li key={index} onClick={() => {
                    if (item.name === 'FAQ') {
                      window.open(item.url);
                      return
                    }
                    if (item.url === '/ins-collection') { message.warning('Coming soon'); return}
                    navigate(item.url);
                    onClose();
                  }}>
                    <p>{item.name}</p>
                    {item.url === '/memes' && <img src={require('../../../assets/images/fire.gif')} alt="" />}
                    {item.name === 'Create' && <img src={require('../../../assets/images/ai.gif')} alt="" className="ai-i" />}
                  </li>
                )
              })
            }
          </ul>
          {
            state.address && <ul>
              {
                TokenMenu.map((item: Menu, index: number) => {
                  return (
                    <li key={`${index} - token`} onClick={() => {
                      if (item.url === '/user/:address') {
                        // dispatch({
                        //     type: Type.SET_OWNER_ADDRESS,
                        //     payload: {
                        //         owner_address: state.address as string
                        //     }
                        // });
                        navigate(`/user/${state.address}`);
                        return
                      };
                      navigate(item.url)
                      onClose();
                    }}>
                      <p>{item.name}</p>
                    </li>
                  )
                })
              }
            </ul>
          }
        </div>
        {state.address && <p>
          <Button type="default" onClick={() => {
            dispatch({
              type: Type.SET_ADDRESS,
              payload: {
                address: ''
              }
            });
            navigate('/')
            onClose();
          }}>
            <PoweroffOutlined />
            Disconnect
          </Button>
        </p>}
      </div>
    </Drawer>
  )
};

export default MobileMenuDraw;