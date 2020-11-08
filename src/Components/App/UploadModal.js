import React from 'react';

import { Modal, ProgressBar } from 'react-bootstrap';
import FontAwesomeIcon from './../../Utils/FontAwesomeIcon';

class UploadModal extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            openModal: false, // Идентификатор открытия модального окна

        }

    }

    componentDidUpdate = () => {

        // Откртиые модального окна загрузки файла
        if (!this.state.openModal && this.props.openModal)
            this.handleShow();

    }

    /**
     * Закрытие модального окна с загрузкой файлов
     */
    handleClose = () => {
        this.props.setCloseModal();
        this.setState({ openModal: false });

    }

    /**
     * Открытие модального окна с загрузкой файлов
     */
    handleShow = () => {
        this.setState({ openModal: true });
    }

    /**
     * Метод вывода строки загрузки файла
     * @param {object} file объект данных одного файла
     * @return {object} 
     */
    FileRow = ({ file }) => {

        let icon = null;

        if (file.status === 1)
            icon = <FontAwesomeIcon icon={["fas", "file-upload"]} className="uploading-file-icon" />;
        else if (file.status === 3)
            icon = <FontAwesomeIcon icon={["fas", "check"]} className="text-success" />;
        else if (file.status === 4)
            icon = <FontAwesomeIcon icon={["fas", "times"]} className="text-danger" />;

        let progress = null,
            percent = this.props.progressfile;

        if (file.id === this.props.fileCurrent)
            progress = <ProgressBar variant="success" now={percent} className="progress-bar-in-file-row" />;

        return (
            <div className="my-1 position-relative d-flex justify-content-between align-items-center">
                <div className="text-truncate">{file.name}</div>
                <div>{icon}</div>
                {progress}
            </div>
        )

    }

    render() {

        let show = this.props.openModal;
        let percent = Math.floor(this.props.progress);
        let closeShow = percent >= 100;
        let variant = closeShow ? "success" : "primary";
        let animated = !closeShow;

        let files = null;

        files = this.props.files.map(file => (
            <this.FileRow file={file} key={file.id} />
        ));

        return (
            <div>
                <Modal
                    show={show}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    animation={false}
                    scrollable={true}
                    id="modal-uploading-files"
                >
                    <Modal.Header closeButton={closeShow} className="position-relative rounded-top">
                        <ProgressBar variant={variant} animated={false} striped={animated} now={percent} className="progress-bar-in-title h-100" />
                        <Modal.Title>Загрузка файлов {percent}%</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {files}
                    </Modal.Body>
                </Modal>
            </div>
        );

    }

}

export default UploadModal;