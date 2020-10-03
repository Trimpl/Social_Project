import * as React from 'react';
import { Link } from 'react-router-dom';
import { Friend } from '../../store/Friends/FriendsStore';
interface IProps {
    listOfFrfiends: Friend[]
}

export class ListOfFriends extends React.Component<IProps> {
    render() {
        return (
            this.props.listOfFrfiends.map((data) => {
                let name = data.firstName.length === 0 ? 'Name' : data.firstName
                return (
                    <div className="people_cell" key={data.id}>
                        <Link to={`/Profile/${data.id}`} >
                            <img src={data.avatar} height="50" width="50" className="img-avatar" alt=""/>
                            <div className="people_cell_name">{name}</div>
                        </Link>
                    </div>
                )
            })
        )
    }
}

