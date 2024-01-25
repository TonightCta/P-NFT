import { ReactElement, ReactNode } from "react";
import './index.scss'

export const ErrorCard = (props:{className?:string}): ReactElement<ReactNode> => {
    return (
        <div className={`error-card ${props.className}`}>
            <div className="d-ul">
                {
                    [1, 2, 3, 4, 5].map((item: number, index: number) => {
                        return (
                            <div key={index} className="d-li">
                                <p>System is being upgraded</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};