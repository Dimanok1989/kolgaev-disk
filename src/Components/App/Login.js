import React from 'react';
import Cookies from 'js-cookie';
import axios from './../../Utils/axios';
import echoerror from './../../Utils/echoerror';

import LoadingModal from './../Modals/LoadingModal';

import { Card, Button, Form, InputGroup, FormControl } from 'react-bootstrap';

class Login extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            login: "", // Логин пользвоателя для авторизации
            password: "", // Пароль для авторизации
            loading: false, // Флаг загрузки
            error: null, // Ошибка авторизации
        }

    }

    /**
     * Аторизация пользователя
     */
    login = () => {

        this.setState({
            loading: true, // Отображение загрузки
        });

        // Данные авторизации из формы
        let form = document.querySelector("form#login-form");
        let formData = new FormData(form);

        // Запрос на авторизацию
        axios.post(`auth/login`, formData).then(({ data }) => {

            // Обнуление ошибки
            this.setState({
                error: null,
            });

            this.props.logined(true); // Возврат идентификатора авторизированного пользователя
            Cookies.set('token', data.token, { expires: 365 }); // Куки с токеном
            localStorage.setItem('token', data.token);

        }).catch(error => {

            // Вывод ошибки
            this.setState({
                error: echoerror(error),
            });

        }).then(() => {

            // Скрытие загрузки
            this.setState({
                loading: false,
            });

        });

    }

    loginEnter = e => e.keyCode === 13 ? this.login() : null;

    render() {

        if (this.props.isLogin)
            return null;

        let loading = this.state.loading; // Флаг загрузки

        // Элемент с ошибкой
        let error = this.state.error ? <div className="text-danger font-weight-bold mt-2">{this.state.error}</div> : null;

        return (
            <div className="bg-dark position-absolute loading-app d-flex align-items-center justify-content-center bg-login-block">
                <Card style={{ width: '20rem' }} className="shadow">
                    <Card.Body>
                        <Card.Title>Добро пожаловать!</Card.Title>
                        <div className="position-relative mt-3">
                            <LoadingModal loading={loading}/>
                            <Form id="login-form">
                                <InputGroup className="mb-2">
                                    <FormControl
                                        name="email"
                                        placeholder="Логин, телефон или email"
                                        aria-label="Логин, телефон или email"
                                        disabled={loading}
                                        onKeyUp={this.loginEnter}
                                    />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        name="password"
                                        type="password"
                                        placeholder="Пароль"
                                        aria-label="Пароль"
                                        disabled={loading}
                                        onKeyUp={this.loginEnter}
                                    />
                                </InputGroup>
                                <Button variant="dark" block onClick={this.login} disabled={loading}>Войти</Button>
                                {error}
                            </Form>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        )

    }

}

export default Login;