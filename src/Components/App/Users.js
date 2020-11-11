import React from 'react';
import { Link } from 'react-router-dom';

import axios from './../../Utils/axios';
import echoerror from './../../Utils/echoerror';

import { ButtonGroup, Button, ProgressBar } from 'react-bootstrap';
import FontAwesomeIcon from './../../Utils/FontAwesomeIcon';

import CreateFolder from './Files/CreateFolder';

class Users extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            users: [], // Список пользователей
            select: null, // Выбранный пользователь
            error: null, // Ошибка получения списка файлов
            sizes: {},
            loading: false,
        }

    }

    componentDidMount = () => {

        this.getUsersList(); // Получение списка пользователей

    }

    componentDidUpdate = prevProps => {

        if (prevProps.user !== this.props.user && this.props.user === null) {

            let usersLi = document.querySelectorAll('.btn-user .user-list-name.font-weight-bold');
            usersLi.forEach(row => {
                row.classList.remove('font-weight-bold');
            });

        }

    }

    /**
     * Получение списка пользователей
     */
    getUsersList = () => {

        this.setState({ error: null });

        axios.post('disk/getUsersList').then(({ data }) => {

            this.setState({
                users: data.users,
                sizes: data.sizes,
            });

            if (this.props.user)
                this.setState({ select: this.props.user });

        }).catch(error => {

            this.setState({ error: echoerror(error) });

        });

    }

    /**
     * Метод вывода строки одного пользователя в списке пользователей
     * 
     * @param {object} user объект данных пользователя 
     * @return {object}
     */
    UserRow = ({ user }) => {

        // Вывод пустой строки
        if (!user.name) {
            return <div className="px-3 py-2 my-2 bg-light loading-user">
                <span>&nbsp;</span>
            </div>
        }

        // Актиыный пользователя
        let classNames = Number(this.props.user) === Number(user.id) ? 'font-weight-bold user-list-name' : 'user-list-name',
            name = user.name,
            email = null;

        // classNames = 'user-list-name';

        if (user.surname)
            name += ` ${user.surname}`;

        if (user.email)
            email = <div><small className="text-muted">{user.email}</small></div>

        // Строка одного пользователя
        return (
            <Link
                className="btn btn-user btn-block text-left my-2"
                onClick={this.setUserId}
                data-id={user.id}
                to={`?user=${user.id}`}
            >
                <div className={classNames}>{name}</div>
                {email}
            </Link>
        )

    }

    /**
     * Установка идентификатора пользователя для загрузки его файлов
     * 
     * @param {object} e event
     */
    setUserId = e => {

        e.currentTarget.blur();

        this.setState({ select: e.currentTarget.dataset.id });

        // Передача идентификатора пользователя в родительский компонент
        this.props.setUserId(e.currentTarget.dataset.id);

    }

    /**
     * Открытие окна выбора файлов
     */
    openInput = e => {

        let elem = document.getElementById('input-upload-files');
        elem.click();

        e.currentTarget.blur();

    }

    pushNewFolder = dir => {

        this.props.pushNewFolder(dir);

    }

    render() {

        if (this.state.error) {

            return (
                <div className="p-2 userlist-menu">
                    <div className="px-3 py-2 my-2 bg-light text-danger">
                        <strong className="mr-1">Ошибка</strong>
                        <span>{this.state.error}</span>
                    </div>
                    <button
                        className="btn btn-warning btn-sm btn-block btn-list-users"
                        onClick={this.getUsersList}
                    >
                        <FontAwesomeIcon icon={["fas", "redo-alt"]} className="mr-1" />
                        <span>Повторить</span>
                    </button>
                </div>
            )

        }

        let userlist = null;

        // Отображение загрузочных строк пользователей
        if (!this.state.users.length) {

            for (let id = 0; id < 3; id++)
                this.state.users.push({ id });

        }

        // Список пользователей
        userlist = this.state.users.map(user => (
            <this.UserRow user={user} key={user.id} />
        ));

        let disabled = true;
        if (Number(localStorage.getItem('user')) === Number(this.state.select))
            disabled = false;

        let limit = null;
        if (typeof this.state.sizes.size != "undefined") {

            let limitPercent = (this.state.sizes.size / this.state.sizes.limit) * 100;

            limit = <div className="my-2">
                <ProgressBar variant="warning" now={limitPercent} className="limit-progress" />
                <div className="mb-2 text-center">
                    <small className="text-muted">Свободно {this.state.sizes.freeFormat} из {this.state.sizes.limitFormat}</small>
                </div>
            </div>

        }

        return (
            <div className="p-2 userlist-menu">

                <ButtonGroup className="w-100">
                    <CreateFolder disabled={disabled} pushNewFolder={this.pushNewFolder} />
                    <Button variant="outline-secondary" disabled={disabled} onClick={this.openInput}>
                        <FontAwesomeIcon icon={["fas", "upload"]} title="Загрузить файл" />
                    </Button>
                </ButtonGroup>

                {limit}

                {userlist}

            </div>
        )

    }

}

export default Users;
