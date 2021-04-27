import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { selectUser } from './../../store/users/actions';

function UserRow(props) {

    const user = props.row;
    const selected = props?.match?.params?.id || null;

    let name = user.name; // Имя пользователя
    name += user.surname ? ` ${user.surname}` : ``; // Добавление фамилии

    let className = ["users-list-row"];

    // if (!props.selectedUser && selected && Number(selected) === Number(user.id))
    //     props.selectUser(user.id);    

    if (props.selectedUser === user.id || Number(selected) === Number(user.id))
        className.push("selected-user-list");

    if (props.loadingFiles) {
        return <span className={`user-row-disabled ${className.join(" ")}`}>{name}</span>
    }

    return <Link onClick={() => props.selectUser(user.id)} to={`/user/${user.id}`} className={className.join(" ")}>
        {name}
    </Link>

}

const mapStateToProps = state => ({
    selectedUser: state.users.selectedUser,
    loadingFiles: state.files.loadingFiles
});

const mapDispatchToProps = {
    selectUser
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserRow));