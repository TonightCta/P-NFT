import { ethereum, web3 } from "./types"
import ABI721 from './abi/721.json'
import ABIMarket from './abi/market.json'
import ABIERC20 from './abi/erc20.json'
import ABISBT from './abi/sbt.json'
import { message } from "antd"
import { useEffect, useState } from 'react';


interface Send {
    from: string,
    gas: string,
    gasLimit: string
}
export const useContract = () => {
    const [gasPrice, setGasPrice] = useState<string>();
    const [NFTContract, setNFTContract] = useState<any>();
    const [ERC20Contract, setERC20Contract] = useState<any>();
    const [MARKETContract, setMARKETContract] = useState<any>();
    const [SBTContract, setSBTContract] = useState<any>();
    const owner: string = ethereum ? ethereum.selectedAddress : '';
    const send: Send = {
        from: owner,
        gas: '0x2dc6c0',
        gasLimit: '0x2dc6c0',
    }
    const cals = async () => {
        const pi = ethereum ? await web3.eth.getGasPrice() : '0';
        setGasPrice(pi);
    };
    const init = async () => {
        await cals();
        setNFTContract(new web3.eth.Contract(ABI721 as any, '0x1a0eCc31DACcA48AA877db575FcBc22e1FEE671b', {
            gasPrice: gasPrice
        }));
        setERC20Contract(new web3.eth.Contract(ABIERC20 as any, '0xFcb06A1a2E8834Fe9E0b49F533E14AB6384f74AC', {
            gasPrice: gasPrice
        }));
        setMARKETContract(new web3.eth.Contract(ABIMarket as any, '0x39D944626c8b95FaDF592D003bcB9BF3467f57E0', {
            gasPrice: gasPrice
        }));
        setSBTContract(new web3.eth.Contract(ABISBT as any, '0x27e67a318f41d7475f409f4a390084b6aa16ac50', {
            gasPrice: gasPrice
        }));
    }
    useEffect(() => {
        init();
    }, [])
    //铸币
    const mint = async (_data_ipfs: string) => {
        return new Promise((resolve, reject) => {
            NFTContract.methods.mintItem(ethereum.selectedAddress, _data_ipfs).send({
                from: owner,
                gas: '7000000'
            })
                .on('receipt', (res: any) => {
                    resolve(res)
                }).on('error', ((err: any) => {
                    resolve(err)
                    message.error(err.message)
                }))
        })
    };
    //查询Owner NFT
    const queryOwner = async () => {
        const total = await NFTContract.methods.balanceOf(ethereum.selectedAddress).call();
        const actions = []
        let getInfo = async (index: number) => {
            try {
                let id = await NFTContract.methods.tokenOfOwnerByIndex(owner, index).call();
                let tokenURI = await NFTContract.methods.tokenURI(id).call();
                return { id, tokenURI }
            } catch (error) {
                console.log('%cerror: ', 'color: pink; background: #aaa;', error)
            }
        };
        for (let index = 0; index < total; index++) {
            actions.push(getInfo(index))
        }

        let results = await Promise.all(actions)
        return results
    }
    //购买
    const buy = async (_order_id: number, _price: string) => {
        return new Promise(async (resolve, reject) => {
            ERC20Contract.methods.approve(
                "0x39D944626c8b95FaDF592D003bcB9BF3467f57E0",
                "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            ).send(send)
                .on('receipt', (res: any) => {
                    MARKETContract.methods.buyByMapi(_order_id).send({
                        from: owner,
                        gas: '7000000'
                    }).on('receipt', (res: any) => {
                        resolve(res)
                    }).on('error', ((err: any) => {
                        console.log(err)
                        resolve(err)
                        message.error(err.message)
                        // reject(err)
                    }))
                }).on('error', ((err: any) => {
                    resolve(err)
                    message.error(err.message)
                    // return
                    resolve(err)
                }));
        })
    }
    //上架
    const putOn = async (_address: string, _token_id: number, _price: number): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            NFTContract.methods.approve("0x39D944626c8b95FaDF592D003bcB9BF3467f57E0", _token_id).send(send)
                .on('receipt', () => {
                    MARKETContract.methods.putOnByMapi(
                        _address.replace(/\"/g, "'"),
                        _token_id,
                        web3.utils.toWei(String(_price), 'ether'))
                        .send({
                            from: owner,
                            gas: '7000000'
                        }).on('receipt', (res: string) => {
                            resolve(res)
                        }).on('error', ((err: any) => {
                            console.log(err)
                            message.error(err.message)
                            resolve(err)
                        }))
                }).on('error', (err: any) => {
                    message.error(err.message);
                    resolve(err)
                })
        })
    }
    //下架
    const takeOff = async (_order_id: number) => {
        return new Promise((resolve, reject) => {
            MARKETContract.methods.off(_order_id).send({
                from: owner,
                gas: '7000000'
            })
                .on('receipt', (res: any) => {
                    resolve(res)
                }).on('error', ((err: any) => {
                    resolve(err)
                    message.error(err.message)
                }))
        })
    }
    //活动领奖
    const claimMint = async () => {
        return new Promise((resolve, reject) => {
            SBTContract.methods.mint().send({
                from: owner,
                gas: '7000000'
            })
                .on('receipt', (res: any) => {
                    resolve(res)
                }).on('error', ((err: any) => {
                    resolve(err)
                    message.error(err.message)
                }))
        })
    };
    //活动Mint查询
    const queryMint = async () => {
        const SBTContractInner = new web3.eth.Contract(ABISBT as any, '0x27e67a318f41d7475f409f4a390084b6aa16ac50', {
            gasPrice: gasPrice
        })
        const total = await SBTContractInner.methods.balanceOf(ethereum.selectedAddress).call();
        return total
    };
    //Mint总量查询
    const officalTotalSupply = async () : Promise<number> => {
        const NFTContractInner = new web3.eth.Contract(ABI721 as any, '0x1a0eCc31DACcA48AA877db575FcBc22e1FEE671b', {
            gasPrice: gasPrice
        })
        const total = await NFTContractInner.methods.totalSupply().call();
        return total
    }
    return {
        mint,
        queryOwner,
        buy,
        putOn,
        takeOff,
        claimMint,
        queryMint,
        officalTotalSupply
    }
}