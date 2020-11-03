import React from 'react';

import axios from './../../Utils/axios';
import echoerror from './../../Utils/echoerror';

class Users extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: true, // Анимация загрузки
            users: [], // Список пользователей
            select: null, // Выбранный пользователь
            filesLoad: false, // Флаг анимации загрузки файлов
            files: [], // Список файлов
            dirs: [], // Список каталогов
        }

    }

    componentDidMount = () => {

        this.getUsersList(); // Получение списка пользователей

    }

    /**
     * Получение списка пользователей
     */
    getUsersList = () => {

        axios.post('disk/getUsersList').then(({ data }) => {

            this.setState({
                users: data.users,
            });

            if (this.props.user) {
                this.setState({
                    select: this.props.user,
                });
            }

        }).catch(error => { }).then(() => { });

    }

    /**
     * Метод вывода строки одного пользователя в списке пользователей
     * @param {object} user объект данных пользователя 
     * @return {object}
     */
    UserRow = ({ user }) => {

        // Вывод пустой строки
        if (!user.name) {
            return <div className="px-3 py-2 my-2 bg-light">
                <span>&nbsp;</span>
            </div>
        }

        // Актиыный пользователя
        let classNames = this.state.select == user.id ? 'font-weight-bold' : '',
            name = user.name,
            email = null;

        if (user.surname)
            name += ` ${user.surname}`;

        if (user.email)
            email = <div><small className="text-muted">{user.email}</small></div>

        // Строка одного пользователя
        return <button
            className="btn btn-light btn-block text-left btn-list-users"
            onClick={this.setUserId}
            data-id={user.id}
        >
            <div className={classNames}>{name}</div>
            {email}
        </button>

    }

    /**
     * Установка идентификатора пользователя для загрузки его файлов
     * @param {object} e event
     */
    setUserId = e => {

        e.currentTarget.blur();

        this.setState({
            select: e.currentTarget.dataset.id,
        });

        // Передача идентификатора пользователя в родительский компонент
        this.props.setUserId(e.currentTarget.dataset.id);

    }

    render() {

        let userlist = null;

        // Отображение загрузочных строк пользователей
        if (!this.state.users.length) {

            for (let id = 0; id < 5; id++)
                this.state.users.push({ id });

        }

        // Список пользователей
        userlist = this.state.users.map(user => (
            <this.UserRow user={user} key={user.id} />
        ));

        return (
            <div className="p-2 userlist-menu">
                {userlist}
            </div>
        )

    }

}

export default Users;
