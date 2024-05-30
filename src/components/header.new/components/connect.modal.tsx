import { useEffect, useState } from "react";
import { Modal } from "antd";
import { useMetamask } from "../../../utils/connect/metamask";
import { useCoinbase } from "../../../utils/connect/coinbase";
// import { useLedger } from "../../../utils/connect/ledger";
import { useWeb3Modal } from '@web3modal/ethers5/react'
import { useUnisat } from "../../../utils/connect/unisat";
import { useOKX } from "../../../utils/connect/okx";
import { usePhantom } from "../../../utils/connect/phantom";
import { useTrustWallet } from "../../../utils/connect/trust.wallet";

interface Wallet {
  id: number,
  name: string,
  logo: string
};

interface Props {
  visible: boolean,
  close: (val: boolean) => void
}

const EVMWalletList: Wallet[] = [
  {
    id: 1,
    name: 'MetaMask',
    logo: require('../../../assets/images/metamask.logo.png')
  },
  {
    id: 2,
    name: 'Coinbase Wallet',
    logo: require('../../../assets/images/coinbase.logo.png')
  },
  {
    id: 3,
    name: 'WalletConnect',
    logo: require('../../../assets/images/walletconnect.logo.png')
  },
  // {
  //     id: 4,
  //     name: 'Ledger',
  //     logo: require('../../../assets/images/ledgerlogo.png')
  // },
]
const BTCWalletList: Wallet[] = [
  {
    id: 4,
    name: 'Unisat',
    logo: require('../../../assets/images/unisat.logo.png')
  },
  {
    id: 5,
    name: 'OKX',
    logo: require('../../../assets/images/okx.logo.png')
  }
]
const SolWalletList: Wallet[] = [
  {
    id: 6,
    name: 'Phantom',
    logo: require('../../../assets/images/phantom.logo.png')
  },
  {
    id: 7,
    name: 'Turst Wallet',
    logo: require('../../../assets/images/trust-wallet.png')
  }
]



const ConnectModal = (props: Props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const { connectMetamask } = useMetamask();
  const { connectCoinbase } = useCoinbase();
  const { connectUnisat } = useUnisat()
  const { connectOKX } = useOKX();
  const { connectPhantom } = usePhantom();
  const { connectTrustWallet } = useTrustWallet();
  const { open } = useWeb3Modal();
  const [active, setActive] = useState<number>(2);
  // const { connectLedger } = useLedger();
  const close = () => {
    props.close(false);
    setActive(1);
    setVisible(false);
  };
  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);
  const connect = (_id: number) => {
    close();
    switch (_id) {
      case 1:
        connectMetamask();
        break;
      case 2:
        connectCoinbase();
        break;
      case 3:
        open();
        break;
      case 4:
        connectUnisat();
        break;
      case 5:
        connectOKX();
        break;
      case 6:
        connectPhantom();
        break;
      case 7:
        connectTrustWallet();
        break;
      default:
        connectMetamask();
    }
  }
  return (
    <Modal open={visible} title={<p style={{ fontSize: '24px' }}>Welcome to Pizzap</p>} footer={null} onCancel={close}>
      <div className="connect-wallet-box">
        <p className="wel-title">Please select sign-in method</p>
        <div className="select-wallet-tabs">
          <ul className="tabs">
            <li className={`${active === 1 ? 'active-tab' : ''}`} onClick={() => {
              setActive(1)
            }}>
              <img src={require('../../../assets/images/bitcoin.logo.png')} alt="" />
              <p>Bitcoin</p>
              <p className="line"></p>
            </li>
            <li className={`${active === 2 ? 'active-tab' : ''}`} onClick={() => {
              setActive(2)
            }}>
              <img src={require('../../../assets/images/eth.tablogo.png')} alt="" />
              <p>Ethereum</p>
              <p className="line"></p>
            </li>
            <li className={`${active === 3 ? 'active-tab' : ''}`} onClick={() => {
              setActive(3)
            }}>
              <img src={require('../../../assets/images/solana.logo.png')} alt="" />
              <p>Solana</p>
              <p className="line"></p>
            </li>
          </ul>
          <ul className="wallets-list">
            {
              (active === 1 && BTCWalletList || active === 2 && EVMWalletList || active === 3 && SolWalletList || BTCWalletList).map((item: Wallet, index: number) => {
                return (
                  <li key={index} onClick={() => {
                    connect(item.id)
                  }}>
                    <img src={item.logo} alt="" />
                    <p>{item.name}</p>
                  </li>
                )
              })
            }
          </ul>
        </div>

      </div>
    </Modal>
  )
};

export default ConnectModal;