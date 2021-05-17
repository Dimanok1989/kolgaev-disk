import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from './system/axios';

import { connect } from 'react-redux';
import { setIsLogin, setIsBlock, setUserData } from './store/actions';
import Echo from 'laravel-echo';

import { Loader } from 'semantic-ui-react';

import './App.css';
import './css/btn.bootstrap.css';

import BlockAccess from './Components/Access/BlockAccess';
import Main from './Components/Main';
import Header from './Components/Header';

window.io = require('socket.io-client');

class App extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: true,
            error: false,
        };

    }

    componentDidMount() {

        this.checkUserAuth();

    }

    /**
     * Подключение к серверу широковещения
     */
     connectEcho = async () => {

        window.Echo = await new Echo({
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

    checkUserAuth = () => {

        axios.post(`auth/user`, { part: "disk" }).then(async ({ data }) => {

            this.props.setUserData(data.user);
            this.props.setIsLogin(true);

            window._userId = data.user.id;

            Cookies.set('main_id', data.main_id, { domain: process.env.REACT_APP_COOKIE_HOST });
            await this.connectEcho();

        }).catch(error => {

            let status = error?.response?.status || false;

            if (status === 403 || status === 401)
                this.props.setIsBlock(true);

            this.props.setIsBlock(true);

        }).then(() => {
            this.setState({ loading: false });
        });

    }

    render() {

        if (this.state.loading) {
            return <div className="loading-global"><Loader active inline="centered" /></div>
        }

        if (this.props.isBlock) {
            return <BlockAccess />
        }

        return <BrowserRouter>
            <Header />
            <div className="content-body">
                <Switch>
                    <Route path="/user/:id" component={Main} />
                    <Route path="/" component={Main} />
                </Switch>
            </div>
        </BrowserRouter>

    }

}

const mapStateToProps = state => ({
    isLogin: state.main.isLogin,
    isBlock: state.main.isBlock,
    user: state.main.user,
});

const mapDispatchToProps = {
    setIsLogin, setIsBlock, setUserData
}

export default connect(mapStateToProps, mapDispatchToProps)(App);