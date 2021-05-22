import React from 'react';
import axios from './../../system/axios';

import { connect } from 'react-redux';
import { setFilesList, showDeleteFile } from './../../store/files/actions';

import { Button, Modal, Icon, Header } from 'semantic-ui-react';

function DeleteFile(props) {

    const { showDeleteFile, setFilesList, file, files } = props;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("asddsf");
    const [save, setSave] = React.useState(false);

    React.useEffect(() => {

        if (showDeleteFile) {
            setError(false);
            setLoading(false);
            setSave(false);
        }

    }, [showDeleteFile]);

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            axios.post('disk/deleteFile', {
                id: file.id
            }).then(({ data }) => {

                const list = [];

                files.forEach(row => {

                    if (file.id !== row.id)
                        list.push(row);

                });

                setFilesList(list);
                showDeleteFile(false);
                
            }).catch(error => {
                setLoading(false);
                setError(axios.getError(error));
            });

        }

        return () => setSave(false);

    }, [save]);

    return <Modal
        basic
        size="tiny"
        open={file ? true : false}
        centered={false}
        onClose={() => showDeleteFile(false)}
        closeOnDimmerClick={false}
    >
        <Header icon>
            <Icon name="trash" />
            <span>Удаление</span>
        </Header>

        <Modal.Content>

            <div className="text-center">Вы действительно хотите удалить {file.is_dir === 0 ? 'файл' : 'каталог'}?</div>
            <div className="mt-3 text-center"><b>{file.name}{file.is_dir === 0 ? `.${file.ext}` : null}</b></div>

        </Modal.Content>

        <Modal.Actions>
            <Button basic color="green" inverted disabled={loading} onClick={() => showDeleteFile(false)}>
                <Icon name="remove" />
                <span>Нет</span>
            </Button>
            <Button color="red" inverted disabled={loading} loading={loading} onClick={() => setSave(true)}>
                <Icon name="trash" />
                <span>Да</span>
            </Button>
        </Modal.Actions>

        {error && typeof error == "string" ? <div className="mb-3" style={{ color: "#ec6b6b" }}><b>Ошибка</b> {error}</div> : null}

    </Modal>

}

const mapStateToProps = state => ({
    file: state.files.showDelete,
    files: state.files.filesList,
});

const mapDispatchToProps = {
    showDeleteFile, setFilesList
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFile);
