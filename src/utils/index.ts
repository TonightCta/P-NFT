import ABI1155 from './abi/1155.json';
import ABI721 from './abi/721.json'
import { ChainInfo, ChainsToken, Config, ConfigName, NetworkConfig, NetworkConfigName, TokenInfo } from './source';

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

export const SupportID: number[] = [8007736, 10067275, 1, 314, 10, 167005]
export const SupportNetwork: Network[] = [
  //Child chain
  {
    chain_id: 1,
    chain_name: 'Ethereum',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://ethereum.publicnode.com'],
    blockExplorerUrls: ['https://etherscan.io']
  },
  {
    chain_id: 8007736,
    chain_name: 'Plian Mainnet Subchain 1',
    nativeCurrency: {
      name: 'PI',
      symbol: 'PI',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.plian.io/child_0'],
    blockExplorerUrls: ['https://piscan.plian.org/?chain=1']
  },
  {
    chain_id: 314,
    chain_name: 'Filecoin',
    nativeCurrency: {
      name: 'FIL',
      symbol: 'FIL',
      decimals: 18
    },
    rpcUrls: ['https://api.node.glif.io/'],
    blockExplorerUrls: ['https://explorer.glif.io/']
  },
  {
    chain_id: 10,
    chain_name: 'OP Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://optimism.publicnode.com'],
    blockExplorerUrls: ['https://optimistic.etherscan.io']
  },
  // {
  //     chain_id: 10067275,
  //     chain_name: 'Plian Testnet Subchain 1',
  //     nativeCurrency: {
  //         name: 'TPI',
  //         symbol: 'TPI',
  //         decimals: 18
  //     },
  //     rpcUrls: ['https://testnet.plian.io/child_test'],
  //     blockExplorerUrls: ['https://piscan.plian.org/index.html']
  // },
  {
    chain_id: 210425,
    chain_name: 'PlatON Mainnet',
    nativeCurrency: {
      name: 'lat',
      symbol: 'LAT',
      decimals: 18
    },
    rpcUrls: ['https://openapi2.platon.network/rpc'],
    blockExplorerUrls: ['https://scan.platon.network']
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
//Date conversion
export const DateConvert = (_time: number): string => {
  const date = new Date(_time * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
  const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
  return `${year}/${month}/${day}`
};

export const FilterAddress = (chain_id: string) => {
  return NetworkConfig.filter((item: Config) => { return item.chain_id === chain_id })[0]
}
export const FilterAddressToName = (chain_id: string) => {
  return NetworkConfigName.filter((item: ConfigName) => { return item.chain_id === chain_id })[0]
}
export const FilterAddressToChain = (chain_name: string) => {
  return NetworkConfigName.filter((item: ConfigName) => { return item.chain_name === chain_name })[0]
}
export const FilterTokenInfo = (symbol: string) => {
  return TokenInfo.filter((item: { symbol: string, logo: string }) => { return item.symbol === symbol })[0]
}
export const FilterChainInfo = (name: string) => {
  return ChainInfo.filter((item: { name: string, logo: string }) => { return item.name === name })[0]
}
export const FilterChainsToken = (symbol: string) => {
  return ChainsToken.filter((item: { symbol: string, logo: string }) => { return item.symbol === symbol })[0]
}

export const randomString = (e?: number): string => {
  const eran = e || 32
  const t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const a = t.length
  let n = ''
  for (let i = 0; i < eran; i++) {
    n += t.charAt(Math.floor(Math.random() * a))
  }
  return n
}
// 倒计时
export const computedCountdonw = (data: number) => {
  const remain = data;
  // 根据传过来的data时间戳,转化成YYYY/MM/DD HH:mm的时间格式
  const d = remain < 0 ? 0 : (remain / 60 / 60 / 24).toFixed(0);
  const h = remain < 0 ? 0 : (remain / 60 / 60 % 24).toFixed(0);
  const m = remain < 0 ? 0 : (remain / 60 % 60).toFixed(0);
  const s = remain < 0 ? 0 : (remain % 60).toFixed(0);
  const D = +d < 10 ? '0' + d + ' ' : d + ' '
  const H = +h < 10 ? '0' + h : h
  const M = +m < 10 ? '0' + m : m;
  const S = +s < 10 ? '0' + s : s
  return {
    D, H, M, S
  }
}

//文件转换
export const Base64ToFile = (_base: string) => {
  const arr = _base.split(',');
  const byteCharacters = atob(arr[1]);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: 'image/jpeg' });
  const file = new File([blob], `${new Date().getTime()}.jpg`, { type: 'image/jpeg' });
  return file;
}
//图片压缩
export const CompressImage = (file: File, quality: number, callback: (compressedBase64: string) => void): void => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const image = new Image();
    image.src = event.target?.result as string;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      ctx?.drawImage(image, 0, 0, image.width, image.height);
      const base64 = canvas.toDataURL('image/jpeg', quality / 100);
      callback(base64);
    }
  };
  reader.readAsDataURL(file);
};
export const addCommasToNumber = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}