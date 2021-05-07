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

    const { setFilesList, selectedUser, setLoadingFiles, openFolder, setOpenFolder, files } = props;
    const selected = props?.match?.params?.id || null;

    const [loading, setLoading] = React.useState(false);
    const [openedFolderForCheck, setOpenedFolderForCheck] = React.useState(null);

    const [currentPage, setCurrentPage] = React.useState(1);
    const [loadPart, setLoadPart] = React.useState(true);
    const [allfiles, setAllfiles] = React.useState(false);

    const query = new URLSearchParams(props.location.search);
    const openedFolder = Number(query.get('folder')) || null;

    if (selected && !selectedUser)
        props.selectUser(selected);

    React.useEffect(() => {

        if (!openedFolderForCheck && openedFolder && !openFolder) {
            setOpenFolder(openedFolder);
            setOpenedFolderForCheck(openedFolder);
        }
        else if (openedFolder !== openFolder) {
            setOpenFolder(openedFolder);
            setAllfiles(false);
            setFilesList([]);
            setCurrentPage(1);
        }

    }, [openedFolderForCheck, openedFolder, openFolder, setOpenFolder]);

    React.useEffect(() => {

        if (selectedUser && loadPart) {

            setLoadingFiles(true);
            setLoading(true);

            axios.post('disk/getUserFiles', {
                id: selectedUser,
                folder: openFolder,
                page: currentPage,
            }).then(({ data }) => {

                // let filesList = Object.assign({}, files);
                let filesList = [];

                files.forEach(file => filesList.push(file));

                data.dirs.forEach(dir => filesList.push(dir));
                data.files.forEach(file => filesList.push(file));

                // // Добавление пустышек для выравнивания сетки файлов
                // if (filesList.length) {
                //     for (let i = 0; i < 7; i++) {
                //         filesList.push({
                //             id: i + "empty",
                //             empty: true,
                //         });
                //     }
                // }

                setFilesList(filesList);
                setCurrentPage(currentPage + 1);
                setLoadPart(false);

                if (data.next > data.last) {
                    setAllfiles(true);
                }

            }).catch(error => {

            }).then(() => {
                setLoadingFiles(false);
                setLoading(false);
            });

        }

    }, [
        loadPart,
        currentPage,
        selectedUser,
        setFilesList,
        setLoadingFiles,
        openFolder,
        files,
        allfiles
    ]);

    /**
     * Обработка прокрутки страницы для динамической подгрузки данных
     */
    const scrollHandler = e => {

        let scrollHeight = e.target.documentElement.scrollHeight,
            scrollTop = e.target.documentElement.scrollTop,
            innerHeight = window.innerHeight;

        let scroll = scrollHeight - (scrollTop + innerHeight);

        if (scroll < 100 && !loadPart && !allfiles) {
            setLoadPart(true);
        }

    }

    React.useEffect(() => {

        document.addEventListener('scroll', scrollHandler);

        return () => document.removeEventListener('scroll', scrollHandler);

    }, []);

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