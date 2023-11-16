import { useContext, useEffect, useState } from "react";
import { Modal } from "antd";
import { useMetamask } from "../../../utils/connect/metamask";
import { useCoinbase } from "../../../utils/connect/coinbase";
// import { useLedger } from "../../../utils/connect/ledger";
import { useWeb3Modal, useWeb3ModalSigner } from '@web3modal/ethers5/react'
import { PNft } from "../../../App";
import { Type } from "../../../utils/types";
import Web3 from "web3";

interface Wallet {
    id: number,
    name: string,
    logo: string
};

interface Props {
    visible: boolean,
    close: (val: boolean) => void
}

const WalletList: Wallet[] = [
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

const ConnectModal = (props: Props) => {
    const [visible, setVisible] = useState<boolean>(false);
    const { dispatch } = useContext(PNft);
    const { connectMetamask } = useMetamask();
    const { connectCoinbase } = useCoinbase();
    const { open } = useWeb3Modal();
    // const { connectLedger } = useLedger();
    const { walletProvider } = useWeb3ModalSigner();
    const close = () => {
        props.close(false);
        setVisible(false);
    };

    useEffect(() => {
        if (!walletProvider || !window.ethereum.selectedProvider) {
            return
        };
        window?.ethereum.setSelectedProvider(walletProvider?.provider);
        dispatch({
            type: Type.SET_WEB3,
            payload: {
                web3: new Web3(walletProvider?.provider as any)
            }
        });
    }, [walletProvider])
    useEffect(() => {
        setVisible(props.visible);
    }, [props.visible])
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
            // case 4:
            //     connectLedger();
            //     break;
            // default:
            //     connectMetamask();
        }
    }
    return (
        <Modal open={visible} title="Welcome to Pizzap" footer={null} onCancel={close}>
            <div className="connect-wallet-box">
                <p className="wel-title">Please select sign-in method</p>
                <ul>
                    {
                        WalletList.map((item: Wallet, index: number) => {
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
        </Modal>
    )
};

export default ConnectModal;