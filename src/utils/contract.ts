import { ethereum, web3 } from "./types"
import ABI721 from './abi/721.json'

export const useContract = () => {
    const mint = async (_data_ipfs: string) => {
        const gasPrice = await web3.eth.getGasPrice();
        const contract = new web3.eth.Contract(ABI721 as any, '0x1a0eCc31DACcA48AA877db575FcBc22e1FEE671b', {
            gasPrice: String(gasPrice)
        });
        return new Promise((resolve, reject) => {
            //@ts-ignore
            contract.methods.mintItem(ethereum.selectedAddress, _data_ipfs).send({
                from: ethereum.selectedAddress,
                value: '0'
            }).on('transactionHash', (res: any) => {
                resolve(res)
            })
            .on('receipt', (res: any) => {
                resolve(res)
            }).on('error', ((err: any) => {
                resolve(err)
            }))
        })
    };
    return {
        mint
    }
}