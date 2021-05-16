import React from 'react';
import axios from './../../system/axios';

import { connect } from 'react-redux';
import { setShowCreateFolder, setFilesList } from './../../store/files/actions';

import { Button, Input, Modal, Message } from 'semantic-ui-react';

/**
 * Инициализация параметров
 * 
 * @param {object} props 
 * @return {object}
 */
function CreateFolder(props) {

    const { selectedUser, openFolder, files, createFolder, setShowCreateFolder, setFilesList } = props;
    const inputRef = React.useRef(null);

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [fileName, setFileName] = React.useState("");

    const [save, setSave] = React.useState(false);

    const changeName = e => setFileName(e.currentTarget.value);

    React.useEffect(() => {

        if (createFolder) {

            setLoading(false);
            setError(false);
            setFileName("Новая папка");
            inputRef.current.focus();

        }

    }, [createFolder]);

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            axios.post('disk/mkdir', {
                name: fileName,
                cd: openFolder,
                user: selectedUser,
            }).then(({ data }) => {

                const list = [];
                list.unshift(data.file);
                files.forEach(file => {
                    list.push(file);
                });

                setFilesList(list);
                setShowCreateFolder(false);
                
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
        open={createFolder}
        closeIcon
        centered={false}
        onClose={() => setShowCreateFolder(null)}
    >
        <Modal.Header>Новый каталог</Modal.Header>
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
                <Button positive disabled={loading} onClick={() => setSave(true)}>Создать</Button>
            </div>

        </Modal.Content>

    </Modal>

}

const mapStateToProps = state => ({
    selectedUser: state.users.selectedUser,
    openFolder: state.files.openFolder,
    files: state.files.filesList,
    createFolder: state.files.createFolder,
});

const mapDispatchToProps = {
    setShowCreateFolder, setFilesList
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateFolder);