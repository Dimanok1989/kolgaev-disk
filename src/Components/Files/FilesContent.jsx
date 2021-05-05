import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from './../../system/axios';

import { connect } from 'react-redux';
import { setFilesList, setLoadingFiles, setOpenFolder } from './../../store/files/actions';
import { selectUser } from './../../store/users/actions';

import { Loader } from 'semantic-ui-react';

import './files.css';
import FilesList from './FilesList';

function FilesContent(props) {

    const { setFilesList, selectedUser, setLoadingFiles, openFolder, setOpenFolder } = props;
    const selected = props?.match?.params?.id || null;
    
    const [loading, setLoading] = React.useState(false);
    const [openedFolderForCheck, setOpenedFolderForCheck] = React.useState(null);

    const query = new URLSearchParams(props.location.search);
    const openedFolder = Number(query.get('folder')) || null;

    if (selected && !selectedUser)
        props.selectUser(selected);

    React.useEffect(() => {
        if (!openedFolderForCheck && openedFolder && !openFolder) {
            setOpenFolder(openedFolder);
            setOpenedFolderForCheck(openedFolder);
        }
    }, [openedFolderForCheck, openedFolder, openFolder, setOpenFolder]);
    
    React.useEffect(() => {

        if (selectedUser) {

            setLoadingFiles(true);
            setLoading(true);
            setFilesList([]);

            axios.post('disk/getUserFiles', {
                id: selectedUser,
                folder: openFolder,
            }).then(({ data }) => {

                let files = [];

                data.dirs.forEach(dir => files.push(dir));
                data.files.forEach(file => files.push(file));

                // Добавление пустышек для выравнивания сетки файлов
                if (files.length) {
                    for (let i = 0; i < 7; i++) {
                        files.push({
                            id: i + "empty",
                            empty: true,
                        });
                    }
                }

                setFilesList(files);

            }).catch(error => {

            }).then(() => {
                setLoadingFiles(false);
                setLoading(false);
            });

        }

    }, [selectedUser, setFilesList, setLoadingFiles, openFolder]);

    const empty = loading 
        ? null
        : <div className="empty-files-list">Файлов еще нет</div>

    const filesList = props.files.length
        ? <FilesList />
        : empty

    return <div className="files-content mx-1">
        {filesList}
        {loading ? <Loader active inline="centered" /> : null}
    </div>

}

const mapStateToProps = state => ({
    files: state.files.filesList,
    selectedUser: state.users.selectedUser,
    openFolder: state.files.openFolder,
});

const mapDispatchToProps = {
    setFilesList, selectUser, setLoadingFiles, setOpenFolder
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilesContent));