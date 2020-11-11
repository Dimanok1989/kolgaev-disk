import React from 'react';
import { withRouter } from "react-router";

import axios from './../../../Utils/axios';
// import echoerror from './../../Utils/echoerror';

import FileRow from './FileRow';
import RenameFile from './RenameFile';
// import Download from './Download';

import { Spinner } from 'react-bootstrap';
import FontAwesomeIcon from './../../../Utils/FontAwesomeIcon';

class Files extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            user: null, // Идентификатор выбранного плоьзователя
            files: [], // Список файлов в каталоге
            dirs: [], // Список папок в каталоге
            filesLoad: true,
            cd: "",
            paths: [],
            newFile: null,
            newFolder: null,
            renameId: null, // Идентификатор файла для смены имени
            folder: null,
            loading: false,
            search: null,
            download: null, // Идентификатор файла для скачивания
            dir: 0, // Идентификатор каталога для скачивания
        }

    }

    componentWillUnmount = () => {

    }

    componentDidMount() {

        if (this.props.user)
            this.getUserFiles(this.props.user); // Получение списка файлов
        else if (!this.props.user) {
            this.setState({ filesLoad: false });
        }

    }

    componentDidUpdate = prevProps => {

        // Отслеживание изменений значения идентификатора пользователя
        if (prevProps.user !== this.props.user || prevProps.folder !== this.props.folder) {

            let user = this.props.user,
                folder = this.props.folder;

            this.setState({ user, folder });

            // Получение списка файлов
            this.getUserFiles(user, folder);

        }

        // Добавление нового файла
        if (prevProps.newFile !== this.props.newFile) {

            let files = this.state.files;
            files.push(this.props.newFile);

            this.setState({
                files,
                newFile: null
            });

        }

        // Добавление нового файла
        if (prevProps.newFolder !== this.props.newFolder) {

            let dirs = this.state.dirs;
            dirs.push(this.props.newFolder);

            this.setState({
                dirs,
                newFolder: null
            });

        }

    }

    /**
     * Открытие папки с файлами
     * 
     * @param {number|null} folder идентификатор каталога 
     */
    openFolder = (folder, search = null) => {

        if (!search) {

            search = `?user=${this.state.user}`;

            let folderId = folder.currentTarget.dataset.folder || null;
            if (folderId)
                search += `&folder=${folderId}`;

        }

        this.props.history.push(search);
        // this.setState({ folder });
        // this.getUserFiles(this.state.user, folder);

    }

    /**
     * Идентификатор работы функции
     * 
     * @var {boolean}
     */
    loadingFileList = false;

    /**
     * Загрузка списка файлов одного пользователя
     * 
     * @param {number} user идентификатор пользователя
     * @param {number|null} folder идентификатор папки с файлами
     */
    getUserFiles = (user, folder = null) => {

        if (this.loadingFileList)
            return null;

        this.loadingFileList = true;

        // Анимация загрузки
        this.setState({ filesLoad: true });

        let formData = new FormData();
        formData.append('id', user);

        // Файлы в папке
        if (folder)
            formData.append('folder', folder);

        this.props.setFolderId(folder);

        axios.post('disk/getUserFiles', formData).then(({ data }) => {

            this.setState({
                files: data.files,
                dirs: data.dirs,
                cd: data.cd,
                paths: data.paths,
            });

        }).catch(error => {

        }).then(() => {

            this.loadingFileList = false;
            this.setState({ filesLoad: false });

        });

    }

    renameFile = renameId => {

        this.setState({ renameId });

    }

    /**
     * Метод установки идентификатора файла для скачивания
     * 
     * @param {number} id идентификатор файла 
     * @param {number} dir идентификатор каталога 
     */
    downloadFile = (id, dir) => {

        this.props.history.push(`/download/${id}`);
        // this.setState({ download: id, dir });

    }

    /**
     * Метод обнуления идентификатора скачиваемого файла при завершении скачивания  
     */
    downloaded = id => {

        this.setState({ download: id });

    }

    /**
     * Метод вывода хлебных крошек
     * 
     * @param {object} paths 
     */
    BreadСrumbs = ({ paths }) => {

        let loading = null;

        if (this.state.loading)
            loading = <FontAwesomeIcon icon={["fas", "spinner"]} className="fa-spin mr-3" />

        let addfolder = null;
        // if (Number(localStorage.getItem('user')) === this.state.user)
        //     addfolder = <div className="cursor-pointer hover mx-1" onClick={this.createFolder} title="Новая папка">
        //         <FontAwesomeIcon icon={["fas", "folder-plus"]} id="add-new-folder" className="text-warning" />
        //     </div>

        let right = <div className="panel-header d-flex align-items-center justify-content-end px-2">
            {loading}
            {addfolder}
        </div>

        let left = <div className="px-2">
            <h5>Файлы</h5>
        </div>;

        let folders = null, // Каталоги для вывода крошек
            last = null, // Текущий откртый каталог
            crumbs = [], // Крошки для вывода
            count = 1; // Счетчик крошек

        if (paths.length)
            crumbs.push({
                id: null,
                name: "Файлы",
            });

        // Сборка данных
        paths.forEach(path => {

            // Определение текущего каталога
            if (count === paths.length) {
                last = <div className="px-2 mb-2">
                    <h5>{path.name}</h5>
                </div>
            }
            else
                crumbs.push(path);

            count++;

        });

        // Вывод крошек
        folders = crumbs.map(crumb => (
            <button className="btn btn-link px-2" type="button" onClick={this.openFolder} data-folder={crumb.id} key={crumb.id}>
                <span className="mr-2">{crumb.name}</span>
                <FontAwesomeIcon icon={["fas", "angle-right"]} />
            </button>
        ));

        if (crumbs.length)
            left = <div>{folders}</div>;

        return (
            <div>
                <div className="d-flex justify-content-between align-items-center">
                    {left}
                    {right}
                </div>
                {last}
            </div>
        )

    }

    render() {

        if (!this.state.user) {

            return (
                <div className="py-3 px-2 flex-grow-1 text-center text-muted">
                    <div className="mt-4">Добро пожаловать в файловый менеджер!</div>
                    <div><small>Чтобы начать, выберите пользователя</small></div>
                </div>
            )

        }

        if (this.state.filesLoad) {

            return <div className="py-3 px-2 flex-grow-1">
                <div className="d-flex justify-content-center align-items-center py-4">
                    <Spinner animation="border" variant="dark" />
                </div>
            </div>

        }

        let fileList = null,
            files = [];

        // Список каталогов
        if (this.state.dirs.length)
            this.state.dirs.forEach(file => files.push(file));

        // Список файлов
        if (this.state.files.length)
            this.state.files.forEach(file => files.push(file));

        // Элементы на страницу
        fileList = files.map(file => (
            <FileRow file={file} key={file.id} renameFile={this.renameFile} user={this.state.user} openFolder={this.openFolder} downloadFile={this.downloadFile} />
        ));

        if (!files.length) {

            fileList = <div className="py-3 px-2 flex-grow-1">
                <div className="text-center pt-4">
                    <span className="font-weight-bold text-muted">Файлов нет</span>
                </div>
            </div>

        }

        return (
            <div className="p-2 flex-grow-1">

                <this.BreadСrumbs paths={this.state.paths} />
                <RenameFile renameId={this.state.renameId} setNullRenameId={this.setNullRenameId} />
                {/* <Download id={this.state.download} dir={this.state.dir} downloaded={this.downloaded} /> */}

                <div className="d-flex align-content-start flex-wrap">
                    {fileList}
                </div>

            </div>
        )

    }

    setNullRenameId = renameId => {

        this.setState({ renameId });

    }

}

export default withRouter(Files);