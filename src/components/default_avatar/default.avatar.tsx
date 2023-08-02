import { ReactElement, useContext } from "react";
import Jazzicon,{ jsNumberForAddress } from 'react-jazzicon';
import { PNft } from "../../App";

interface Props{
    diameter?:number,
    address?:string
}

const DefaultAvatar = (props:Props) : ReactElement => {
    const { state } = useContext(PNft)
    return (
        <div className="default-avatar">
            <Jazzicon diameter={props.diameter ? props.diameter : 40} seed={jsNumberForAddress(props.address ? props.address : state.address as string)}/>
        </div>
    )
};

export default DefaultAvatar;