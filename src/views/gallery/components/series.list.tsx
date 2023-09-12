import { ReactElement, useEffect, useState } from "react";
import { GroupUsersList } from '../../../request/api'

interface Props {
    id: number,
    name: string
}

interface User {
    user_address: string,
    user_avatar_url: string,
    user_name: string
}

const SeriesList = (props: Props): ReactElement => {
    const [userList, setUserList] = useState<User[]>([]);
    const getUserList = async () => {
        const result = await GroupUsersList({
            group_id: props.id,
            page_size: 5
        });
        const { data } = result;
        setUserList(data.data.item);
    };
    useEffect(() => {
        getUserList();
    }, [])
    return (
        <div className="series-list">
            <p className="public-title">{props.name}</p>
            <ul className="public-list">
                {
                    userList.map((item: User, index: number) => {
                        return (
                            <li key={index}>
                                <img src={item.user_avatar_url} alt="" />
                                <p>{item.user_name}</p>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
};


export default SeriesList;

