import React from 'react';

import { Card, Button, Form, InputGroup, FormControl } from 'react-bootstrap';

class BlockAccess extends React.Component {

    render() {

        return (

            <div className="bg-dark position-absolute loading-app d-flex align-items-center justify-content-center bg-login-block">

                <Card style={{ width: '20rem' }} className="shadow">

                    <Card.Body>

                        <Card.Title className="mb-0">Приветствую</Card.Title>
                        <small>{window.user.name || null}</small>

                        <div className="text-danger mt-2">К сожалению, доступ к диску ограничен! Чтобы получить его, Вы знаете к кому обратиться...</div>

                    </Card.Body>

                </Card>

            </div>

        )

    }

}

export default BlockAccess;
