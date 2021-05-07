import React from 'react';
import axios from './../../system/axios';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { setUsersList, selectUser } from './../../store/users/actions';

import './users-list.css'
import UserRow from './UserRow';

function UsersList(props) {

    const setUsersList = props.setUsersList;
    const selectUser = props.selectUser;

    const [error, setError] = React.useState(false);

    const userIdUri = props?.match?.params?.id || null;
    const userId = props.userId;

    /** Проверка выбранного пользователя при заходе по прямой ссылке */
    React.useEffect(() => {

        if (!userId && userIdUri) {
            selectUser(Number(userIdUri));
        }

    }, [userId, userIdUri, selectUser]);

    /** Загрузка списка пользователей */
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
    userId: state.users.selectedUser,
});

const mapDispatchToProps = {
    setUsersList, selectUser
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UsersList));