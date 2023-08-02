import { getAddress } from 'sats-connect'

export const useXVerse = () => {
    const connectXVerse = async () => {
        const getAddressOptions: any = {
            payload: {
                purposes: ['ordinals', 'payment'],
                message: 'Address for receiving Ordinals and payments',
                network: {
                    type: 'Mainnet'
                },
            },
            onFinish: (response: any) => {
                // console.log(response)
            },
            onCancel: () => alert('Request canceled'),
        }

        await getAddress(getAddressOptions);
    };
    return {
        connectXVerse
    }
}