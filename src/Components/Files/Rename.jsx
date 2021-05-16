import React from 'react';
import axios from './../../system/axios';

import { connect } from 'react-redux';
import { setRenameFileId, setFilesList } from './../../store/files/actions';

import { Button, Input, Modal, Message } from 'semantic-ui-react'

function Rename(props) {

    const { files, rename, setRenameFileId, setFilesList } = props;
    const inputRef = React.useRef(null);

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [fileName, setFileName] = React.useState("");

    const [save, setSave] = React.useState(false);

    React.useEffect(() => {

        if (rename) {

            setLoading(true);
            setError(false);
            setFileName("");

            axios.post('disk/getNameFile', {
                id: rename,
            }).then(({ data }) => {

                setLoading(false);
                setError(false);
                setFileName(data.name);
                inputRef.current.focus();

            }).catch(error => {

                setLoading(false);
                setError(true);

            });

        }

    }, [rename]);

    const changeName = e => setFileName(e.currentTarget.value);

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            const formdata = new FormData();
            formdata.append('id', rename);
            formdata.append('name', fileName);

            axios.post('disk/rename', formdata).then(({ data }) => {

                const list = [];
                files.forEach(file => {

                    if (file.id === rename)
                        file.name = data.onlyName;

                    list.push(file);
                });

                setFilesList(list);
                setRenameFileId(null);
                
            }).catch(error => {
                setLoading(false);
                setError(axios.getError(error));
                inputRef.current.focus();
            });


        }

        return () => setSave(false);

    }, [save]);

    return <Modal
        size="tiny"
        open={rename ? true : false}
        closeIcon
        centered={false}
        onClose={() => setRenameFileId(null)}
    >
        <Modal.Header>Переименовать</Modal.Header>
        <Modal.Content>

            <Input
                ref={inputRef}
                placeholder="Укажите имя файла..."
                fluid
                loading={loading}
                disabled={loading}
                value={fileName}
                onChange={changeName}
                onKeyUp={e => e.keyCode === 13 ? setSave(true) : null}
            />

            {error && typeof error == "string" ? <Message negative size="mini">{error}</Message> : null}

            <div className="d-flex justify-content-end align-items-center mt-3">
                <Button positive disabled={loading || error === true} onClick={() => setSave(true)}>Сохранить</Button>
            </div>

        </Modal.Content>

    </Modal>;

}

const mapStateToProps = state => ({
    rename: state.files.rename,
    files: state.files.filesList,
});

const mapDispatchToProps = {
    setRenameFileId, setFilesList
}

export default connect(mapStateToProps, mapDispatchToProps)(Rename);