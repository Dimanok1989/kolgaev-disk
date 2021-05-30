import React from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import {
    setOpenFolder,
    setShowPhoto,
    setRenameFileId,
    showDeleteFile,
    setDownloadArchive,
    setLoadingFile,
    setFilesList
} from './../../store/files/actions';
import { setAudioPlay } from './../../store/players/actions';

import axios from './../../system/axios';

import FileRow from './FileRow';
import ShowPhoto from './../Photos/ShowPhoto';

/**
 * Вывод списка файлов выбранного пользователя и выбранного каталога
 * 
 * @param {object} props 
 * @return {object}
 */
function FilesList(props) {

    const { setDownloadArchive, createArchiveProcess, setAudioPlay } = props;
    const { loadingFile, setLoadingFile } = props;
    const { files, setFilesList} = props;

    const [hide, setHide] = React.useState(null);

    React.useEffect(() => {

        if (hide) {

            setLoadingFile(hide.id);

            axios.post('disk/hideFile', {
                id: hide.id
            }).then(({ data }) => {

                let update = [...files];

                update.forEach(file => {
                    if (file.id === hide.id)
                        file.hiden = data.file.hiden;
                });

                setFilesList(update);

            }).catch(error => {

            }).then(() => {
                setLoadingFile(null);
            });

        }

        return () => setHide(null);

    }, [hide]);

    const clickFile = file => {

        if (file.is_dir === 1) {
            props.setOpenFolder(file.id);
            props.history.push(`?folder=${file.id}`);
        }
        else if (file.thumb_litle || String(file.mime_type).indexOf("video/") >= 0) {
            props.setShowPhoto(file.id);
        }
        else if (String(file.mime_type).indexOf("audio/") >= 0 && !loadingFile) {
            setAudioPlay(file.id);
        }

    }

    // Добавление пустышек для выравнивания сетки файлов
    let filesList = [];
    for (let i = 0; i < 7; i++) {
        filesList.push({
            id: i + "empty",
            empty: true,
        });
    }

    const list = files.map(file => <FileRow

        key={file.id}

        file={file}
        user={props.user.id}
        userId={props.userId}

        clickFile={clickFile}

        setRenameFileId={props.setRenameFileId}
        showDeleteFile={props.showDeleteFile}
        createArchiveProcess={createArchiveProcess}
        downloadArchive={setDownloadArchive}
        setAudioPlay={setAudioPlay}

        hide={hide}
        setHide={setHide}

    />);
    const empties = filesList.map(file => <FileRow key={file.id} file={file} />);

    return <div className="files-list">

        {list}
        {empties}

        <ShowPhoto />

    </div>

}

const mapStateToProps = state => ({
    files: state.files.filesList,
    user: state.main.user,
    userId: state.users.selectedUser,
    createArchiveProcess: state.files.createArchiveProcess,
    loadingFile: state.files.loadingFile,
});

const mapDispatchToProps = {
    setOpenFolder,
    setShowPhoto,
    setRenameFileId,
    showDeleteFile,
    setDownloadArchive,
    setAudioPlay,
    setLoadingFile,
    setFilesList
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilesList));