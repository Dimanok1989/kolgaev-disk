import React from 'react';

import axios from './../../Utils/axios';
import { Modal, FormControl, Button } from 'react-bootstrap';

class RenameFile extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            show: false,
            renameId: null,
        }

    }

    componentDidUpdate = (prevProps) => {

        // Отслеживание изменений значения идентификатора выбранного файла
        if (prevProps.renameId !== this.props.renameId) {

            this.setState({ renameId: this.props.renameId });
            this.getNameFile(this.props.renameId);

        }

    }

    getNameFile = renameId => {

        if (!renameId)
            return null;

        this.renameId = renameId;

        let block = document.getElementById(`file-row-block-${renameId}`),
            loading = block.querySelector(`.loading-file`),
            name = block.querySelector(`.file-row-name`);

        loading.style.display = "flex";

        let formdata = new FormData();
        formdata.append('id', renameId);

        axios.post('disk/getNameFile', formdata).then(({ data }) => {
            this.setState({ show: true });
            document.getElementById('name-file-rename').value = data.name;
        }).catch(error => {
            name.classList.add('text-danger');
        }).then(() => {
            loading.style.display = "none";
            this.props.setNullRenameId(null);
        });

    }

    renameId = null;

    rename = e => {

        let id = this.renameId,
            newname = document.getElementById('name-file-rename').value,
            block = document.getElementById(`file-row-block-${id}`),
            loading = block.querySelector(`.loading-file`),
            name = block.querySelector(`.file-row-name`);

        loading.style.display = "flex";
        this.setState({ show: false });

        let formdata = new FormData();
        formdata.append('id', id);
        formdata.append('name', newname);

        axios.post('disk/rename', formdata).then(({ data }) => {
            name.textContent = data.name;
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
                onHide={() => this.setState({ show: false })}
                id="rename-modal"
                centered={true}
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Переименовать</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl
                        placeholder="Имя файла"
                        aria-label="Имя файла"
                        name="filename"
                        id="name-file-rename"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={this.rename}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        )

    }

}

export default RenameFile;