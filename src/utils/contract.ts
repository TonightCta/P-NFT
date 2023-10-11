import { ethereum, web3 } from "./types"
import ABI721 from './abi/721.json'
import ABIMarket from './abi/market.json'
import ABIERC20 from './abi/erc20.json'
import NormalABIERC20 from './abi/normal_erc20.json'
import ABISBT from './abi/sbt.json'
import { message } from "antd"
import { useContext, useEffect, useState } from 'react';
import * as Address from "./source"
import { FilterAddress, calsMarks } from "."
import { useSwitchChain } from "../hooks/chain"
import { PNft } from "../App"


interface Send {
    from: string,
    gas: string,
    gasLimit: string
}
export const LAND: string = process.env.REACT_APP_LAND as string;
export const MODE: string = process.env.REACT_APP_CURRENTMODE as string;

export const NFTAddress: string = LAND === 'taiko' ? MODE === 'taikomain' ? Address.TaikoContractAddress721Main : Address.TaikoContractAddress721Test : MODE === 'production' ? Address.PlianContractAddress721Main : Address.PlianContractAddress721Test;
export const MarketAddress: string = LAND === 'taiko' ? MODE === 'taikomain' ? Address.TaikoContractAddressMarketMain : Address.TaikoContractAddressMarketTest : MODE === 'production' ? Address.PlianContractAddressMarketMain : Address.PlianContractAddressMarketTest;
// const Fee: string = LAND === 'taiko' ? web3.utils.toWei('0.01', "ether") : MODE === 'production' ? web3.utils.toWei('0.4', "ether") : '0'
const Gas: string = LAND === 'taiko' ? '420000' : '7000000'

export const useContract = () => {
    const [gasPrice, setGasPrice] = useState<string>();
    const [NFTContract, setNFTContract] = useState<any>();
    const [ERC20Contract, setERC20Contract] = useState<any>();
    const [MARKETContract, setMARKETContract] = useState<any>();
    const [SBTContract, setSBTContract] = useState<any>();
    const { switchC } = useSwitchChain();
    const { state } = useContext(PNft);
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
        const NFTAddress = LAND === 'taiko' ? MODE === 'taikomain' ? Address.TaikoContractAddress721Main : Address.TaikoContractAddress721Test : MODE === 'production' ? FilterAddress(state.chain as string).contract_721 : FilterAddress(state.chain as string).contract_721_test;
        const MarketAddress: string = LAND === 'taiko' ? MODE === 'taikomain' ? Address.TaikoContractAddressMarketMain : Address.TaikoContractAddressMarketTest : MODE === 'production' ? FilterAddress(state.chain as string).contract_market : FilterAddress(state.chain as string).contract_market_test;
        setNFTContract(new web3.eth.Contract(ABI721 as any, NFTAddress, {
            gasPrice: gasPrice
        }));
        setERC20Contract(new web3.eth.Contract(ABIERC20 as any, FilterAddress(state.chain as string).contract_erc20, {
            gasPrice: gasPrice
        }));
        setMARKETContract(new web3.eth.Contract(ABIMarket as any, MarketAddress, {
            gasPrice: gasPrice
        }));
        setSBTContract(new web3.eth.Contract(ABISBT as any, Address.PlianContractSBTTest, {
            gasPrice: gasPrice
        }));
    };
    useEffect(() => {
        init();
    }, [state.chain])
    //铸币
    const mint = async (_data_ipfs: string) => {
        if (!ethereum) {
            message.error('You need to install Metamask to use this feature');
            return
        }
        const Gas: string = LAND === 'taiko' ? '420000' : `${state.chain === '8007736' && '7000000' || state.chain === '314' && '20000000' || state.chain === '10' && '15000000'}`
        const Fee: string = LAND === 'taiko' ? web3.utils.toWei('0.01', "ether") : MODE === 'production' ? web3.utils.toWei(`${state.chain === '8007736' && '0.4' || state.chain === '10' && '0.0001' || '0.01'}`, "ether") : '0'
        return new Promise((resolve, reject) => {
            NFTContract.methods.mint(ethereum.selectedAddress, _data_ipfs).send({
                from: owner,
                gas: Gas,
                value: Fee
            })
                .on('receipt', (res: any) => {
                    resolve(res)
                }).on('error', ((err: any) => {
                    resolve(err)
                    console.log(err)
                    message.error(err.message)
                }))
        })
    };
    //查询Owner NFT
    const queryOwner = async () => {
        if (!ethereum) {
            message.error('You need to install Metamask to use this feature');
            return
        }
        await switchC(+(state.chain as string));
        const total = await NFTContract.methods.balanceOf(ethereum.selectedAddress).call();
        console.log(total)
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
    };
    //ERC20授权
    const approveToken = async () => {
        return new Promise((resolve, reject) => {
            ERC20Contract.methods.approve(
                calsMarks(FilterAddress(state.chain as string).contract_erc20),
                "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            ).send(send).on('receipt', (res: any) => {
                resolve(res)
            }).on('error', (err: any) => {
                resolve(err);
                message.error(err.message)
            })
        })
    }
    //购买
    const buy = async (_order_id: string, _price: string, _paymod: string) => {
        if (!ethereum) {
            message.error('You need to install Metamask to use this feature');
            return
        }
        return new Promise(async (resolve, reject) => {
            if (_paymod === 'PI' || _paymod === 'ETH') {
                MARKETContract.methods.buy(_order_id).send({
                    from: owner,
                    gas: Gas,
                    value: _price,
                }).on('receipt', (res: any) => {
                    resolve(res)
                }).on('error', ((err: any) => {
                    resolve(err)
                    message.error(err.message)
                }))
            } else {
                MARKETContract.methods.buy(_order_id).send({
                    from: owner,
                    gas: Gas,
                }).on('receipt', (res: any) => {
                    resolve(res)
                }).on('error', ((err: any) => {
                    resolve(err)
                    message.error(err.message)
                }))
            }
        })
    }
    //上架 - 授权
    const putApprove = async (_token_id: number): Promise<string> => {
        if (!ethereum) {
            message.error('You need to install Metamask to use this feature');
            return 'uninstall'
        }
        const MarketAddress: string = LAND === 'taiko' ? MODE === 'taikomain' ? Address.TaikoContractAddressMarketMain : Address.TaikoContractAddressMarketTest : MODE === 'production' ? FilterAddress(state.chain as string).contract_market : FilterAddress(state.chain as string).contract_market_test;
        return new Promise(async (resolve, reject) => {
            NFTContract.methods.approve(MarketAddress, _token_id).send(LAND === 'taiko' ? {
                from: owner,
                gas: Gas,
            } : send)
                .on('receipt', (res: any) => {
                    resolve(res);
                }).on('error', (err: any) => {
                    message.error(err.message);
                    resolve(err)
                })
        })
    }
    //上架 - list
    const putList = async (_token_id: number, _price: number, _address: string): Promise<string> => {
        if (!ethereum) {
            message.error('You need to install Metamask to use this feature');
            return 'uninstall'
        }
        const NFTAddress = LAND === 'taiko' ? MODE === 'taikomain' ? Address.TaikoContractAddress721Main : Address.TaikoContractAddress721Test : MODE === 'production' ? FilterAddress(state.chain as string).contract_721 : FilterAddress(state.chain as string).contract_721_test;
        return new Promise((resolve, reject) => {
            MARKETContract.methods.list(
                calsMarks(NFTAddress),
                _token_id,
                calsMarks(_address),
                web3.utils.toWei(String(_price), 'ether'))
                .send({
                    from: owner,
                    gas: Gas
                }).on('receipt', (res: string) => {
                    resolve(res)
                }).on('error', ((err: any) => {
                    message.error(err.message)
                    resolve(err)
                }))
        })
    }
    //下架
    const takeOff = async (_order_id: number) => {
        if (!ethereum) {
            message.error('You need to install Metamask to use this feature');
            return 'uninstall'
        }
        return new Promise((resolve, reject) => {
            MARKETContract.methods.off(_order_id).send({
                from: owner,
                gas: Gas
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
        if (!ethereum) {
            message.error('You need to install Metamask to use this feature');
            return 'uninstall'
        }
        return new Promise((resolve, reject) => {
            SBTContract.methods.mint().send({
                from: owner,
                gas: Gas
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
        if (!ethereum) {
            message.error('You need to install Metamask to use this feature');
            return
        }
        const SBTContractInner = new web3.eth.Contract(ABISBT as any, Address.PlianContractSBTTest, {
            gasPrice: gasPrice
        })
        const total = await SBTContractInner.methods.balanceOf(ethereum.selectedAddress).call();
        return total
    };
    //Mint总量查询
    const officalTotalSupply = async (): Promise<number> => {
        if (!ethereum) {
            message.error('You need to install Metamask to use this feature');
            return 0
        }
        const NFTAddress = LAND === 'taiko' ? MODE === 'taikomain' ? Address.TaikoContractAddress721Main : Address.TaikoContractAddress721Test : MODE === 'production' ? FilterAddress(state.chain as string).contract_721 : FilterAddress(state.chain as string).contract_721_test;
        const NFTContractInner = new web3.eth.Contract(ABI721 as any, NFTAddress, {
            gasPrice: gasPrice
        })
        const total = await NFTContractInner.methods.totalSupply().call();
        return total
    }
    //授权查询
    const queryApprove = async (_token_id: number): Promise<string> => {
        if (!ethereum) {
            message.error('You need to install Metamask to use this feature');
            return 'uninstall'
        }
        console.log(NFTContract)
        const approve = await NFTContract.methods.getApproved(_token_id).call();
        return approve
    }
    const queryERC20Approve = async (_owner: string, _market_address: string): Promise<string | number> => {
        if (!ethereum) {
            message.error('You need to install Metamask to use this feature');
            return 'uninstall'
        };
        const result = await ERC20Contract.methods.allowance(_owner, _market_address).call();
        return result
    };
    const getBalance = async () => {
        const result = await web3.eth.getBalance(owner);
        return result;
    }
    const balanceErc20 = async (_token_address: string) => {
        const contract = new web3.eth.Contract(NormalABIERC20 as any, _token_address, {
            gasPrice: gasPrice
        });
        const balance = await contract.methods.balanceOf(owner).call()
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
        queryApprove,
        queryERC20Approve,
        approveToken,
        getBalance,
        balanceErc20
    }
}