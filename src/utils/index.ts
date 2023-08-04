import ABI1155 from './abi/1155.json';
import ABI721 from './abi/721.json'

interface Address {
    address_1155: string,
    address_721: string,
    abi_1155: unknown,
    abi_721: unknown
}
export interface Network {
    chain_id: number,
    chain_name: string,
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number
    },
    rpcUrls: string[],
    blockExplorerUrls: string[]
};

export const SupportID: number[] = [8007736, 10067275]
export const SupportNetwork: Network[] = [
    //Child chain
    {
        chain_id: 8007736,
        chain_name: 'Plian Mainnet Subchain 1',
        nativeCurrency: {
            name: 'PI',
            symbol: 'PI',
            decimals: 18
        },
        rpcUrls: ['https://mainnet.plian.io/child_0'],
        blockExplorerUrls: ['https://piscan.plian.org/index.html']
    },
    {
        chain_id: 10067275,
        chain_name: 'Plian Testnet Subchain 1',
        nativeCurrency: {
            name: 'TPI',
            symbol: 'TPI',
            decimals: 18
        },
        rpcUrls: ['https://testnet.plian.io/child_test'],
        blockExplorerUrls: ['https://piscan.plian.org/index.html']
    },
    {
        chain_id: 167005,
        chain_name: 'Taiko Testnet',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://rpc.test.taiko.xyz'],
        blockExplorerUrls: ['https://explorer.test.taiko.xyz']
    }
];
type AddressCall = {
    8007736: Address,
    10067275: Address
}
export const NetworkAddress: AddressCall = {
    8007736: {
        address_1155: '0x8ceB525a426BEB63b831f3e6B71678BC1D25523A',
        address_721: '0x1a0eCc31DACcA48AA877db575FcBc22e1FEE671b',
        abi_1155: ABI1155,
        abi_721: ABI721
    },
    10067275: {
        address_1155: '',
        address_721: '0xAe729a910f4FCa452B578C5f2ED1EB13391d651E',
        abi_1155: ABI1155,
        abi_721: ABI721
    }
}
export const calsAddress = (_address: string) => {
    return _address.substring(0, 6) + '...' + _address.substring(_address.length - 4, _address.length)
}
export const calsMarks = (_address: string) => {
    return _address.replace(/\"/g, "'")
}

//获取地址栏参数
export const GetUrlKey = (name: string, url: string): string => {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || ''
};