import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import axios from '../Utils/axios';

import Login from './App/Login';
import Header from './App/Header';
import Content from './App/Content';
import DownloadPage from './App/Download';

import { Spinner } from 'react-bootstrap';

import Echo from 'laravel-echo';
window.io = require('socket.io-client');

class App extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: true,
            isLogin: false,
        };

    }

    componentDidMount() {

        this.checkLogin(); // Проверка авторизации

    }

    loginClick = (e) => {

        this.setState({ isLogin: !this.state.isLogin });

    }

    logined = async login => {

        await this.connectEcho();
        this.setState({ isLogin: login });

    }

    /**
     * Подключение к серверу широковещения
     */
    connectEcho = async () => {

        window.Echo = new Echo({
            broadcaster: 'socket.io',
            host: process.env.REACT_APP_SOCKET_IO_URL,
            path: '/ws/socket.io',
            auth: {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                }
            },
        });

    }

    /**
     * Метод проверки авторизации
     * @return {null}
     */
    checkLogin = () => {

        axios.post(`auth/user`).then(({ data }) => {

            this.setState({ isLogin: true });

            localStorage.setItem('user', data.id); // Идентификатор пользователя
            window.user = data;

            this.connectEcho();

        }).catch(error => {

        }).then(() => {

            this.setState({ loading: false });

        });

    }

    render() {

        if (this.state.loading) {
            return (
                <div className="d-flex justify-content-center align-items-center position-absolute loading-app">
                    <Spinner animation="border" variant="dark" />
                </div>
            )
        }

        if (!this.state.isLogin)
            return <Login logined={this.logined} />

        return (
            <BrowserRouter>
                <div>
                    <Header isLogin={this.state.isLogin} />
                    <Switch>
                        <Route path="/download/:id" component={DownloadPage} />
                        <Route path="/download" component={DownloadPage} />
                        <Route path="/" component={Content} />
                        {/* <Route path="*" component={NotFound} /> */}
                    </Switch>
                </div>
            </BrowserRouter>
        )

    }

}

export default App;
