import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Cookies from 'js-cookie';

import axios from '../Utils/axios';
import echoerror from '../Utils/echoerror';

import Login from './App/Login';
import BlockAccess from './App/BlockAccess';
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
            isBlock: false,
            error: null,
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
            host: process.env.REACT_APP_WS_PROTOCOL + "://" + process.env.REACT_APP_WS_HOST,
            path: process.env.REACT_APP_WS_PATH ? "/" + process.env.REACT_APP_WS_PATH : "",
            auth: {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                }
            },
        });

    }

    /**
     * Метод проверки авторизации
     * 
     * @return {null}
     */
    checkLogin = () => {

        axios.post(`auth/user`, { part: "disk" }).then(({ data }) => {

            this.setState({ isLogin: true });

            localStorage.setItem('user', data.user.id); // Идентификатор пользователя
            window.user = data.user;

            Cookies.set('main_id', data.main_id, { domain: process.env.REACT_APP_COOKIE_HOST })
            this.connectEcho();

        }).catch(error => {

            let status = error.response.status || null,
                message = echoerror(error);

            if (status === 403)
                this.setState({ isBlock: true });

            if (typeof error.response.data == "object")
                window.user = error.response.data.user || {};

            this.setState({ error: message });
            console.error(message);

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

        if (this.state.isBlock)
            return <BlockAccess />

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
