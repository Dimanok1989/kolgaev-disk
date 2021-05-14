import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from './system/axios';

import { connect } from 'react-redux';
import { setIsLogin, setIsBlock, setUserData } from './store/actions';

import { Loader } from 'semantic-ui-react';

import BlockAccess from './Components/Access/BlockAccess';
import Main from './Components/Main';
import Header from './Components/Header';

import './App.css';
import './css/btn.bootstrap.css';

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

    checkUserAuth = () => {

        axios.post(`auth/user`, { part: "disk" }).then(({ data }) => {

            this.props.setUserData(data.user);
            this.props.setIsLogin(true);

            Cookies.set('main_id', data.main_id, { domain: process.env.REACT_APP_COOKIE_HOST });

        }).catch(error => {

            let status = error?.response?.status || false;

            if (status === 403)
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
            <div>
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