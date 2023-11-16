import ETH from '@ledgerhq/hw-app-eth';
// import Transport from "@ledgerhq/hw-transport-u2f";

// const eth = new ETH('')


export const useLedger = () => {
    const connectLedger = async () => {
        console.log('ledger')
    };
    return {
        connectLedger
    }
};