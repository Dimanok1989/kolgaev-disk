import React from 'react';
import axios from './../../system/axios';

import { connect } from 'react-redux';
import { setUsersList } from './../../store/users/actions';

import './users-list.css'
import UserRow from './UserRow';

function UsersList(props) {

    const setUsersList = props.setUsersList;
    
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        axios.post('disk/getUsersList').then(({ data }) => {
            setUsersList(data.users);
        }).catch(error => {
            setError(axios.getError(error));
        });
    }, [setUsersList]);

    const users = props.usersList.map(user => <UserRow key={user.id} row={user} />);

    if (error)
        return <div>{error}</div>

    return <div>{users}</div>

}

const mapStateToProps = state => ({
    usersList: state.users.usersList,
});

const mapDispatchToProps = {
    setUsersList
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersList);