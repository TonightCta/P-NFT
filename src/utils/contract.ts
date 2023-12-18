import { web3, web3P } from "./types"
import ABI721 from './abi/721.json'
import ABIMarket from './abi/market.json'
import ABIERC20 from './abi/erc20.json'
import NormalABIERC20 from './abi/normal_erc20.json'
import ABISBT from './abi/sbt.json'
import BBCABI from './abi/bbc.json'
import HASHABI from './abi/hash.json'
import { message } from "antd"
import { useContext, useEffect, useState } from 'react';
import * as Address from "./source"
import { FilterAddress, FilterAddressToName, calsMarks } from "."
import { useSwitchChain } from "../hooks/chain"
import { PNft } from "../App"
import OPABI from './abi/op.json'
// import { parseEther, parseGwei } from 'viem'
// import Web3 from "web3"


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

export const useContract = () => {
    const [gasPrice, setGasPrice] = useState<string>();
    const [NFTContract, setNFTContract] = useState<any>();
    const [ERC20Contract, setERC20Contract] = useState<any>();
    const [MARKETContract, setMARKETContract] = useState<any>();
    const [SBTContract, setSBTContract] = useState<any>();
    const [BBCContract, setBBCContract] = useState<any>();
    const { switchC } = useSwitchChain();
    const { state } = useContext(PNft);
    const owner: string = state.ethereum ? state.ethereum.selectedAddress : '';
    const send: Send = {
        from: owner,
        gas: state.chain === '10' ? '' : '0x2dc6c0',
        gasLimit: state.chain === '10' ? '' : '0x2dc6c0',
    }
    const cals = async () => {
        const pi = state.ethereum ? await state.web3.eth.getGasPrice() : '0';
        setGasPrice(pi);
    };
    const init = async () => {
        await cals();
        const NFTAddress = LAND === 'taiko' ? MODE === 'taikomain' ? Address.TaikoContractAddress721Main : Address.TaikoContractAddress721Test : MODE === 'production' ? FilterAddress(state.chain as string).contract_721 : FilterAddress(state.chain as string).contract_721_test;
        const MarketAddress: string = LAND === 'taiko' ? MODE === 'taikomain' ? Address.TaikoContractAddressMarketMain : Address.TaikoContractAddressMarketTest : MODE === 'production' ? FilterAddress(state.chain as string).contract_market : FilterAddress(state.chain as string).contract_market_test;
        setNFTContract(new web3.eth.Contract(ABI721 as any, NFTAddress, {
            gasPrice: gasPrice
        }));
        setBBCContract(new web3.eth.Contract(BBCABI as any, '0x8e25e5c37983f915adcf212c00b2fe12d998699c', {
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
    }, [state.chain, state.web3])
    //铸币
    const mint = async (_data_ipfs: string) => {
        if (!state.ethereum) {
            message.error('You need to install Metamask to use this feature');
            return
        };
        const Fee: string = web3.utils.toWei(FilterAddressToName(web3.utils.hexToNumberString(state.ethereum.chainId)).fee, 'ether');
        const Gas: string = FilterAddressToName(state.chain as string).gas;
        return new Promise((resolve, reject) => {
            NFTContract.methods.mint(state.ethereum.selectedAddress, _data_ipfs).send({
                from: owner,
                gas: Gas,
                value: Fee,
                type: '0x1'
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
        if (!state.ethereum) {
            message.error('You need to install Metamask to use this feature');
            return
        }
        await switchC(+(state.chain as string));
        const total = await NFTContract.methods.balanceOf(state.ethereum.selectedAddress).call();
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
    const approveToken = async (_token_address: string) => {
        const contract = new state.web3.eth.Contract(ABIERC20 as any, _token_address, {
            gasPrice: gasPrice
        });
        return new Promise((resolve, reject) => {
            contract.methods.approve(
                calsMarks(FilterAddress(state.chain as string).contract_market),
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
        const Gas: string = FilterAddressToName(state.chain as string).gas;
        if (!state.ethereum) {
            message.error('You need to install Metamask to use this feature');
            return
        }
        return new Promise(async (resolve, reject) => {
            if (_paymod === 'PI' || _paymod === 'ETH' || _paymod === 'LAT') {
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
        if (!state.ethereum) {
            message.error('You need to install Metamask to use this feature');
            return 'uninstall'
        }
        const Gas: string = FilterAddressToName(state.chain as string).gas;
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
        if (!state.ethereum) {
            message.error('You need to install Metamask to use this feature');
            return 'uninstall'
        }
        const Gas: string = FilterAddressToName(state.chain as string).gas;
        const NFTAddress = LAND === 'taiko' ? MODE === 'taikomain' ? Address.TaikoContractAddress721Main : Address.TaikoContractAddress721Test : MODE === 'production' ? FilterAddress(state.chain as string).contract_721 : FilterAddress(state.chain as string).contract_721_test;
        return new Promise((resolve, reject) => {
            MARKETContract.methods.list(
                calsMarks(NFTAddress),
                _token_id,
                calsMarks(_address),
                state.web3.utils.toWei(String(_price), 'ether'))
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
        if (!state.ethereum) {
            message.error('You need to install Metamask to use this feature');
            return 'uninstall'
        }
        const Gas: string = FilterAddressToName(state.chain as string).gas;
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
        if (!state.ethereum) {
            message.error('You need to install Metamask to use this feature');
            return 'uninstall'
        }
        const Gas: string = FilterAddressToName(state.chain as string).gas;
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
        if (!state.ethereum) {
            message.error('You need to install Metamask to use this feature');
            return
        }
        const SBTContractInner = new state.web3.eth.Contract(ABISBT as any, Address.PlianContractSBTTest, {
            gasPrice: gasPrice
        })
        const total = await SBTContractInner.methods.balanceOf(owner).call();
        return total
    };
    //Mint总量查询
    const officalTotalSupply = async (): Promise<number> => {
        if (!state.ethereum) {
            message.error('You need to install Metamask to use this feature');
            return 0
        }
        const NFTAddress = LAND === 'taiko' ? MODE === 'taikomain' ? Address.TaikoContractAddress721Main : Address.TaikoContractAddress721Test : MODE === 'production' ? FilterAddress(state.chain as string).contract_721 : FilterAddress(state.chain as string).contract_721_test;
        const NFTContractInner = new state.web3.eth.Contract(ABI721 as any, NFTAddress, {
            gasPrice: gasPrice
        })
        const total = await NFTContractInner.methods.totalSupply().call();
        return total
    }
    //授权查询
    const queryApprove = async (_token_id: number): Promise<string> => {
        if (!state.ethereum) {
            message.error('You need to install Metamask to use this feature');
            return 'uninstall'
        }
        const approve = await NFTContract.methods.getApproved(_token_id).call();
        console.log(approve)
        return approve
    }
    const queryERC20Approve = async (_owner: string, _market_address: string): Promise<string | number> => {
        if (!state.ethereum) {
            message.error('You need to install Metamask to use this feature');
            return 'uninstall'
        };
        const result = await ERC20Contract.methods.allowance(_owner, _market_address).call();
        return result
    };
    const getBalance = async () => {
        const result = await state.web3.eth.getBalance(owner);
        return result;
    }
    const balanceErc20 = async (_token_address: string): Promise<string> => {
        const contract = new state.web3.eth.Contract(NormalABIERC20 as any, _token_address);
        const balance = await contract.methods.balanceOf(owner).call();
        return balance;
    }
    const transHash = async (_amount: string, _nonce: string): Promise<string> => {
        const contract = new web3P.eth.Contract(HASHABI as any, '0x60D8b4198E78ee47a27d12B0D188C56578824875');
        //@ts-ignore
        const hash: string = await contract.methods.hashTransaction(state.address, +_amount, _nonce).call();
        return hash
    }
    const BBCPoolTotal = async (): Promise<number> => {
        const total = await BBCContract.methods.totalSupply().call();
        return +total
    };
    const BBCBuy = async (_hash: string, _amount: string, _nonce: string) => {
        const Gas: string = FilterAddressToName(state.chain as string).gas;
        return new Promise((resolve, reject) => {
            BBCContract.methods.buy(_hash, _nonce, +_amount).send({
                value: state.web3.utils.toWei(String(+_amount * 0.05)),
                from: owner,
                gas: Gas
            }).on('receipt', (res: string) => {
                resolve(res)
            }).on('error', ((err: any) => {
                message.error(err.message)
                resolve(err)
            }))
        })
    };
    const signOrder = async (_amount: number, _start_date: number, _end_date: number, _token_id: number) => {
        const orderComponents = {
            Offerer: state.address,
            Offer: [
                {
                    ItemType: 2,
                    Token: "0x169625caf5d3f14e8d9f680db6923343b80d1b1e",
                    IdentifierOrCriteria: String(_token_id),//Token ID
                    StartAmount: "1",
                    EndAmount: "1"
                }
            ],
            Consideration: [
                {
                    ItemType: 0,
                    Token: "0x0000000000000000000000000000000000000000",
                    IdentifierOrCriteria: "0",
                    StartAmount: String(web3.utils.toWei(String((_amount * 0.975).toFixed(4)), 'ether')),
                    EndAmount: String(web3.utils.toWei(String((_amount * 0.975).toFixed(4)), 'ether')),
                    Recipient: state.address
                },
                {
                    ItemType: 0,
                    Token: "0x0000000000000000000000000000000000000000",
                    IdentifierOrCriteria: "0",
                    StartAmount: String(web3.utils.toWei(String((_amount * 0.025).toFixed(4)), 'ether')),
                    EndAmount: String(web3.utils.toWei(String((_amount * 0.025).toFixed(4)), 'ether')),
                    Recipient: "0x0000a26b00c1f0df003000390027140000faa719"
                },
            ],
            StartTime: String(_start_date),
            EndTime: String(_end_date),
            OrderType: 1,
            Zone: "0x0000000000000000000000000000000000000000",
            ZoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
            Salt: "0x0000000000000000000000000000000000000000000000000000000000000000",
            ConduitKey: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
            Counter: "0"
        };
        const domain = {
            name: "Pizzap",
            version: "1.0",
            chainId: 10, // Ethereum mainnet
            verifyingContract: "0x1E0049783F008A0085193E00003D00cd54003c71", // Replace with the actual smart contract address
        };
        const message = {
            ...orderComponents,
            ...domain,
        };
        const types = {
            OrderComponents: [
                { name: "Offerer", type: "address" },
                { name: "Offer", type: "Offer[]" },
                { name: "Consideration", type: "Conside[]" },
                { name: "StartTime", type: "string" },
                { name: "EndTime", type: "string" },
                { name: "OrderType", type: "uint256" },
                { name: "Zone", type: "address" },
                { name: "ZoneHash", type: "string" },
                { name: "Salt", type: "string" },
                { name: "ConduitKey", type: "string" },
                { name: "Counter", type: "string" },
            ],
            Offer: [
                { name: 'ItemType', type: 'uint256' },
                { name: 'Token', type: 'address' },
                { name: 'IdentifierOrCriteria', type: 'string' },
                { name: 'StartAmount', type: 'string' },
                { name: 'EndAmount', type: 'string' }
            ],
            Conside: [
                { name: 'ItemType', type: 'uint256' },
                { name: 'Token', type: 'address' },
                { name: 'IdentifierOrCriteria', type: 'string' },
                { name: 'StartAmount', type: 'string' },
                { name: 'EndAmount', type: 'string' },
                { name: 'Recipient', type: 'address' }
            ]
        };
        const data = {
            types: types,
            domain: domain,
            primaryType: "OrderComponents",
            message: message,
        };
        // const encoder = new TextEncoder();
        // const encodedData = encoder.encode(JSON.stringify(data));
        // console.log(encodedData)
        return new Promise((resolve, reject) => {
            state.ethereum.request({
                method: "eth_signTypedData_v4",
                params: [state.address, JSON.stringify(data)],
            }).then((res: string) => {
                console.log(res);
                resolve(res)
            }).catch((err: unknown) => {
                resolve(err)
                console.log(err);
            })
        })
    };
    const OPBuy = (_amount: string, _key: string) => {
        const Gas: string = FilterAddressToName(state.chain as string).gas;
        const OPContract = new state.web3.Contract(OPABI as any, '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC', {
            gasPrice: gasPrice
        });
        return new Promise((resolve, reject) => {
            OPContract.methods.fulfillAdvancedOrder(_amount, 1, 1, _key, owner).send({
                value: _amount,
                from: owner,
                gas: Gas
            }).on('receipt', (res: string) => {
                resolve(res)
            }).on('error', (err: any) => {
                message.error(err.message);
                resolve(err)
            })
        })
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
        balanceErc20,
        BBCPoolTotal,
        transHash,
        BBCBuy,
        signOrder,
        OPBuy
    }
};

// export const useGetNFTApprove = (token_id: number) => {
//     const { state } = useContext(PNft);
//     const NFTAddress = LAND === 'taiko' ? MODE === 'taikomain' ? Address.TaikoContractAddress721Main : Address.TaikoContractAddress721Test : MODE === 'production' ? FilterAddress(state.chain as string).contract_721 : FilterAddress(state.chain as string).contract_721_test;
//     const data = useContractRead({
//         address: NFTAddress as `0x`,
//         abi: ABI721,
//         functionName: 'getApproved',
//         args: [token_id],
//     });
//     return data
// };
// export const useSetNFTApprove = (token_id: number) => {
//     const { state } = useContext(PNft);
//     const MarketAddress: string = LAND === 'taiko' ? MODE === 'taikomain' ? Address.TaikoContractAddressMarketMain : Address.TaikoContractAddressMarketTest : MODE === 'production' ? FilterAddress(state.chain as string).contract_market : FilterAddress(state.chain as string).contract_market_test;
//     const NFTAddress = LAND === 'taiko' ? MODE === 'taikomain' ? Address.TaikoContractAddress721Main : Address.TaikoContractAddress721Test : MODE === 'production' ? FilterAddress(state.chain as string).contract_721 : FilterAddress(state.chain as string).contract_721_test;
//     const { write, data, isSuccess } = useContractWrite({
//         address: NFTAddress as `0x`,
//         abi: ABI721,
//         functionName: 'approve',
//         args: [MarketAddress, token_id],
//         gasPrice: parseGwei('20'),
//     });
//     return { write, approveData: data, approveStatus: isSuccess }
// };
// export const useMint = (_data_ipfs: string,) => {
//     const { state } = useContext(PNft);
//     // const Fee: string = LAND === 'taiko' ? web3.utils.toWei('0.01', "ether") : MODE === 'production' ? web3.utils.toWei(`${state.chain === '8007736' && '0.4' || state.chain === '10' && '0.0001' || '0.01'}`, "ether") : '0'
//     const { write, data, isSuccess } = useContractWrite({
//         address: NFTAddress as `0x`,
//         abi: ABI721,
//         functionName: 'approve',
//         args: [state.address, _data_ipfs],
//         value: parseEther('0.01'),
//         gasPrice: parseGwei('20'),
//     });
//     return { write, mintData: data, mintStatus: isSuccess }
// }