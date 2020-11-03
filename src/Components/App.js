import React from 'react';
import axios from '../Utils/axios';
import { Spinner } from 'react-bootstrap';

import Login from './App/Login';
import Header from './App/Header';
import Content from './App/Content';

class App extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: true,
            isLogin: false,
        };

    }

    componentDidMount() {

        // Проверка авторизации
        this.checkLogin();

    }

    loginClick = (e) => {
        this.setState({ isLogin: !this.state.isLogin });
    }

    logined = login => {
        this.setState({
            isLogin: login,
        });
    }

    /**
     * Метод проверки авторизации
     * @return {null}
     */
    checkLogin = () => {

        axios.post(`auth/user`).then(({ data }) => {

            this.setState({
                isLogin: true,
            });

        }).catch(error => {

        }).then(() => {

            this.setState({
                loading: false,
            });

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

        return (
            <div>
                <Login isLogin={this.state.isLogin} logined={this.logined} />
                <Header isLogin={this.state.isLogin} />
                <Content isLogin={this.state.isLogin} />
            </div>
        )

    }

}

export default App;
