import { ethereum, web3 } from "./types"
import ABI721 from './abi/721.json'
import ABIMarket from './abi/market.json'
import ABIERC20 from './abi/erc20.json'
import ABISBT from './abi/sbt.json'
import { message } from "antd"
import { useEffect, useState } from 'react';
import { PlianContractAddress721Main, PlianContractAddress721Test, PlianContractAddressMarketMain, PlianContractAddressMarketTest, PlianContractERC20Test, PlianContractSBTTest, SystemAddress } from "./source"
import { calsMarks } from "."


interface Send {
    from: string,
    gas: string,
    gasLimit: string
}
const MODE: string = process.env.REACT_APP_CURRENTMODE as string;
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
        setNFTContract(new web3.eth.Contract(ABI721 as any, MODE === 'production' ? PlianContractAddress721Main : PlianContractAddress721Test, {
            gasPrice: gasPrice
        }));
        setERC20Contract(new web3.eth.Contract(ABIERC20 as any, PlianContractERC20Test, {
            gasPrice: gasPrice
        }));
        setMARKETContract(new web3.eth.Contract(ABIMarket as any, MODE === 'production' ? PlianContractAddressMarketMain : PlianContractAddressMarketTest, {
            gasPrice: gasPrice
        }));
        setSBTContract(new web3.eth.Contract(ABISBT as any, PlianContractSBTTest, {
            gasPrice: gasPrice
        }));
    }
    useEffect(() => {
        init();
    }, [])
    //铸币
    const mint = async (_data_ipfs: string) => {
        return new Promise((resolve, reject) => {
            NFTContract.methods.mint(ethereum.selectedAddress, _data_ipfs).send({
                from: owner,
                gas: '7000000',
                value: MODE === 'production' ? web3.utils.toWei('0.1', "ether") : '0'
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
    const buy = async (_order_id: string, _price: string, _paymod: string) => {
        return new Promise(async (resolve, reject) => {
            if (MODE === 'production') {
                MARKETContract.methods.buy(_order_id).send({
                    from: owner,
                    gas: '7000000',
                    value: _paymod === 'PI' ? _price : '0',
                }).on('receipt', (res: any) => {
                    resolve(res)
                }).on('error', ((err: any) => {
                    resolve(err)
                    message.error(err.message)
                    // reject(err)
                }))
            } else {
                ERC20Contract.methods.approve(
                    calsMarks(PlianContractAddressMarketTest),
                    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                ).send(send)
                    .on('receipt', (res: any) => {
                        MARKETContract.methods.buy(_order_id).send({
                            from: owner,
                            gas: '7000000',
                            value: _paymod === 'PI' ? _price : '0',
                        }).on('receipt', (res: any) => {
                            resolve(res)
                        }).on('error', ((err: any) => {
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
            }


        })
    }
    //上架 - 授权
    const putApprove = async (_token_id:number): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            NFTContract.methods.approve(MODE === 'production' ? PlianContractAddressMarketMain : PlianContractAddressMarketTest, _token_id).send(send)
                .on('receipt', (res:any) => {
                    resolve(res);
                }).on('error', (err: any) => {
                    message.error(err.message);
                    resolve(err)
                })
        })
    }
    //上架 - list
    const putList = async (_token_id: number, _price: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            MARKETContract.methods.list(
                MODE === 'production' ? calsMarks(PlianContractAddress721Main) : calsMarks(PlianContractAddress721Test),
                _token_id,
                MODE === 'production' ? calsMarks(SystemAddress) : calsMarks(PlianContractERC20Test),
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
        const SBTContractInner = new web3.eth.Contract(ABISBT as any, PlianContractSBTTest, {
            gasPrice: gasPrice
        })
        const total = await SBTContractInner.methods.balanceOf(ethereum.selectedAddress).call();
        return total
    };
    //Mint总量查询
    const officalTotalSupply = async (): Promise<number> => {
        const NFTContractInner = new web3.eth.Contract(ABI721 as any, MODE === 'production' ? PlianContractAddress721Main : PlianContractAddress721Test, {
            gasPrice: gasPrice
        })
        const total = await NFTContractInner.methods.totalSupply().call();
        return total
    }
    //授权查询
    const queryApprove = async (_token_id: number) : Promise<string> => {
        // const NFTContractInner = new web3.eth.Contract(ABI721 as any, MODE === 'production' ? PlianContractAddress721Main : PlianContractAddress721Test, {
        //     gasPrice: gasPrice
        // })
        const approve = await NFTContract.methods.getApproved(_token_id).call();
        return approve
    }
    return {
        mint,
        queryOwner,
        buy,
        putApprove,
        putList,
        takeOff,
        claimMint,
        queryMint,
        officalTotalSupply,
        queryApprove
    }
}