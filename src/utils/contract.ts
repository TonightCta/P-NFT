import { ethereum, web3 } from "./types"
import ABI721 from './abi/721.json'
import ABIMarket from './abi/market.json'
import ABIERC20 from './abi/erc20.json'
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
    const owner: string = ethereum.selectedAddress;
    const send: Send = {
        from: owner,
        gas: '0x2dc6c0',
        gasLimit: '0x2dc6c0',
    }
    const cals = async () => {
        const pi = await web3.eth.getGasPrice();
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
        }))
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
            console.log('address', _address)
            console.log('token_id', _token_id)
            console.log('price', web3.utils.toWei(String(_price), 'ether'))
            console.log('from', owner);
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
    return {
        mint,
        queryOwner,
        buy,
        putOn,
        takeOff
    }
}