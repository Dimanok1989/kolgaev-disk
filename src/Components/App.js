import React from 'react';
import axios from '../Utils/axios';
import { Spinner } from 'react-bootstrap';

import Login from './App/Login';
import Header from './App/Header';
import Content from './App/Content';
import DownloadPage from './App/Download';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

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

        this.setState({ isLogin: login });

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
