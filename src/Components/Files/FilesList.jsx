import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from './../../system/axios';
import Cookies from 'js-cookie';

import { connect } from 'react-redux';
import { setOpenFolder, setShowPhoto, setRenameFileId, showDeleteFile } from './../../store/files/actions';

import FileRow from './FileRow';
import CreateArchiveProcess from './CreateArchiveProcess';
import ShowPhoto from './../Photos/ShowPhoto';

/**
 * Вывод списка файлов выбранного пользователя и выбранного каталога
 * 
 * @param {object} props 
 * @return {object}
 */
function FilesList(props) {

    const { files, archiveComplete, setArchiveComplete } = props;

    const [ download, downloadArchive ] = React.useState(null);
    const [ createProcess, setCreateProcess ] = React.useState(null);
    const [ completeCreate, setCompleteCreate ] = React.useState(null);
    const [ downloadData, setDownloadData ] = React.useState(null);

    React.useEffect(() => {

        if (archiveComplete) {

            setDownloadData(archiveComplete.archive);
            setCreateProcess("completed");
            setCompleteCreate(true);

            setTimeout(() => {
                setCreateProcess(false);
                setCompleteCreate(false);
            }, 2000);

        }

        return () => setArchiveComplete(null);

    }, [archiveComplete]);

    React.useEffect(() => {

        if (download) {

            setCreateProcess(true);
            
            axios.post('disk/downloadFolder', download).then(({ data }) => {
                setCreateProcess({ size: data.size });
            }).catch(error => {
                setCreateProcess(axios.getError(error));
                setCompleteCreate(true);
            });

        }

        return () => downloadArchive(false);

    }, [download]);

    React.useEffect(() => {

        if (downloadData) {
        
            const link = document.createElement('a');
            const url = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}/download`;
            const main_id = Cookies.get('main_id') || null;
        
            link.href = `${url}/${downloadData.name}?folder=${downloadData.id}&main_id=${main_id}`;
            document.body.appendChild(link);
        
            link.click();
        
            document.body.removeChild(link);
        
        }

    }, [downloadData]);

    const clickFile = file => {

        if (file.is_dir === 1) {
            props.setOpenFolder(file.id);
            props.history.push(`?folder=${file.id}`);
        }
        else if (file.thumb_litle) {
            props.setShowPhoto(file.id);
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
        clickFile={clickFile}
        user={props.user.id}
        userId={props.userId}
        setRenameFileId={props.setRenameFileId}
        showDeleteFile={props.showDeleteFile}
        downloadArchive={downloadArchive}
    />);
    const empties = filesList.map(file => <FileRow key={file.id} file={file} />);

    return <div className="files-list">

        {list}
        {empties}

        <ShowPhoto />
        <CreateArchiveProcess
            process={createProcess}
            setCreateProcess={setCreateProcess}
            completeCreate={completeCreate}
            setCompleteCreate={setCompleteCreate}
        />

    </div>

}

const mapStateToProps = state => ({
    files: state.files.filesList,
    user: state.main.user,
    userId: state.users.selectedUser,
});

const mapDispatchToProps = {
    setOpenFolder, setShowPhoto, setRenameFileId, showDeleteFile
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilesList));