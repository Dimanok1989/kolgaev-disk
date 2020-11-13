import React from 'react';

import axios from './../../../Utils/axios';
import { Modal, Button } from 'react-bootstrap';

class DeleteFile extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            show: false,
            deleteId: null,
        }

    }

    componentDidUpdate = (prevProps) => {

        if (prevProps.deleteId !== this.props.deleteId) {

            this.setState({ deleteId: this.props.deleteId });

            if (this.props.deleteId !== null)
                this.setState({ show: true })

        }

    }

    hideModal = () => {

        this.setState({ show: false })
        this.props.setNullDeleteId(false);

    }

    deleteFile = e => {

        let id = this.state.deleteId,
            block = document.getElementById(`file-row-block-${id}`),
            loading = block.querySelector(`.loading-file`),
            name = block.querySelector(`.file-row-name`);

        loading.style.display = "flex";
        this.hideModal();

        let formdata = new FormData();
        formdata.append('id', id);

        axios.post('disk/deleteFile', formdata).then(({ data }) => {
            this.props.setNullDeleteId(id);
        }).catch(error => {
            name.classList.add('text-danger');
        }).then(() => {
            loading.style.display = "none";
        });

    }

    render() {

        return (
            <Modal
                show={this.state.show}
                onHide={this.hideModal}
                id="delete-modal"
                centered={true}
                backdrop="static"
                size="sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Удалить файл?</Modal.Title>
                </Modal.Header>

                <Modal.Body className="text-center">
                    <Button variant="success" onClick={this.hideModal} className="mx-1">Отмена</Button>
                    <Button variant="danger" onClick={this.deleteFile} className="mx-1">Удалить</Button>
                </Modal.Body>

            </Modal>
        )

    }

}

export default DeleteFile;