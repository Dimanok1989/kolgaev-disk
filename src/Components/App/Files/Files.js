import React from 'react';
import { withRouter } from "react-router";

import axios from './../../../Utils/axios';
// import echoerror from './../../Utils/echoerror';

import FileRow from './FileRow';
import RenameFile from './RenameFile';
import DeleteFile from './DeleteFile';
import ShowImage from './ShowImage';
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
            filesLoadAppend: false,
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
            deleteId: null, // Идентификатор файла для удаления
            showImageId: null, // Идентификатор посматриваемого изобравжения
        }

    }

    componentWillUnmount = () => {

        window.removeEventListener('scroll', this.onScrollList);

    }

    componentDidMount() {

        if (this.props.user)
            this.getUserFiles(this.props.user, this.props.folder); // Получение списка файлов
        else if (!this.props.user)
            this.setState({ filesLoad: false });

        window.socketId = window.Echo.connector.socket.id || null;

        window.Echo
            .channel('kolgaevru_database_disk')
            .listen('Disk', ev => this.updateSocket(ev.data));

        window.addEventListener('scroll', this.onScrollList);

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
     * Метод обвновления данных, полученных из канала вещаний
     * 
     * @param {object} data Данные, полученные из канала
     */
    updateSocket = data => {

        // console.log(data);

        if (Number(this.props.user) !== Number(data.user))
            return false;

        // Обновление эскиза
        if (data.thumbnails) {

            let files = this.state.files,
                file = files.findIndex(item => item.id === data.thumbnails.id);

            if (file >= 0) {

                files[file].thumb_litle = data.thumbnails.litle;
                files[file].thumb_middle = data.thumbnails.middle;

                this.setState({ files });

            }

        }

        if (window.socketId === data.socketId)
            return false;

        // Обработка создания новой папки
        if (data.mkdir) {

            if (Number(this.props.folder) !== Number(data.mkdir.in_dir))
                return false;

            let dirs = this.state.dirs;
            dirs.push(data.mkdir);
            this.setState({ dirs });

        }

        // Обработка добавления нового файла
        if (data.new) {

            if (Number(this.props.folder) !== Number(data.new.in_dir))
                return false;

            let files = this.state.files;
            files.push(data.new);
            this.setState({ files });

        }

        // Переименовывание файла
        if (data.rename) {

            if (Number(this.props.folder) !== Number(data.rename.in_dir))
                return false;

            let is_dir = data.rename.is_dir,
                list = is_dir ? this.state.dirs : this.state.files;

            for (let id in list) {

                if (list[id].id === data.rename.id)
                    list[id].name = data.rename.name;

            }

            is_dir ? this.setState({ dirs: list }) : this.setState({ files: list })

        }

        // Удаление файла
        if (data.delete) {

            if (Number(this.props.folder) !== Number(data.rename.in_dir))
                return false;

            let is_dir = data.delete.is_dir,
                list = is_dir ? this.state.dirs : this.state.files;

            for (let id in list) {

                if (list[id].id === data.delete.id)
                    delete (list[id]);

            }

            is_dir ? this.setState({ dirs: list }) : this.setState({ files: list })

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
        this.page = 1;
        this.allfiles = false;

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

            if (data.next > data.last)
                this.allfiles = true;

            this.page = data.next;

        }).catch(error => {

        }).then(() => {

            this.loadingFileList = false;
            this.setState({ filesLoad: false });

        });

    }

    page = 1;
    allfiles = false;

    getFilesForAppend = () => {

        if (this.loadingFileList)
            return null;

        this.loadingFileList = true;
        this.setState({ filesLoadAppend: true });

        let formData = new FormData();
        formData.append('id', this.state.user);
        formData.append('page', this.page);

        // Файлы в папке
        if (this.state.folder)
            formData.append('folder', this.state.folder);

        axios.post('disk/getUserFiles', formData).then(({ data }) => {

            let files = this.state.files,
                dirs = this.state.dirs;

            data.files.forEach(file => files.push(file));
            data.dirs.forEach(dir => dirs.push(dir));

            this.setState({
                files,
                dirs
            });

            if (data.next > data.last)
                this.allfiles = true;

            this.page = data.next;

        }).catch(error => {

        }).then(() => {

            this.loadingFileList = false;
            this.setState({ filesLoadAppend: false });

        });

    }

    onScrollList = e => {

        let bottomCoord = document.documentElement.getBoundingClientRect().bottom,
            height = document.documentElement.clientHeight;

        if (height >= bottomCoord && !this.loadingFileList && !this.allfiles) {
            this.getFilesForAppend();
        }

    }

    /**
     * Установка идентификатора файла для смены имени
     * 
     * @param {number} renameId Идентификатор файла
     */
    renameFile = renameId => this.setState({ renameId });

    setNullRenameId = renameId => this.setState({ renameId });

    /**
     * Установка идентификатора файла для удаления
     * 
     * @param {number} deleteId Идентификатор файла
     */
    deleteFile = deleteId => this.setState({ deleteId });

    setNullDeleteId = deleteId => {

        let state = { deleteId: null };

        if (deleteId !== false) {

            let files = this.state.files,
                dirs = this.state.dirs;

            for (let id in files) {
                if (Number(files[id].id) === Number(deleteId)) {
                    delete (files[id]);
                    state.files = files;
                }
            }

            for (let id in dirs) {
                if (Number(dirs[id].id) === Number(deleteId)) {
                    delete (dirs[id]);
                    state.dirs = dirs;
                }
            }

        }

        this.setState(state);

    };

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
     * Начало просмотра изображения
     * 
     * @param {object} e Event
     */
    showImage = e => this.setState({ showImageId: e.currentTarget.dataset.file })

    closeShowImage = () => this.setState({ showImageId: null })

    changeImage = (step, id) => {

        let files = this.state.files,
            next = null,
            back = null,
            first = null,
            last = null,
            nextstep = false,
            backstep = false;

        files.forEach(file => {

            // Првоерка файла только с миниатюрой
            if (file.thumb_middle) {

                // Первый файл в списке
                if (!first)
                    first = file.id;

                // Последний файл в списке
                last = file.id;

                // Следующий файл для просмотра
                if (nextstep && next === null)
                    next = file.id;

                if (Number(file.id) === Number(id)) {
                    backstep = true;
                    nextstep = true;
                }

                // Предыдущий файл
                if (!backstep)
                    back = file.id;

            }

        });

        // Если открыта первая фотка
        if (back === null)
            back = last;

        // Если открыта последняя фотка
        if (next === null)
            next = first;

        if (step === "next")
            this.setState({ showImageId: next });
        else if (step === "back")
            this.setState({ showImageId: back });

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
        fileList = files.map((file, key) => (
            <FileRow file={file} key={key} renameFile={this.renameFile} user={this.state.user} openFolder={this.openFolder} downloadFile={this.downloadFile} deleteFile={this.deleteFile} showImage={this.showImage} />
        ));

        if (!files.length) {

            fileList = <div className="py-3 px-2 flex-grow-1">
                <div className="text-center pt-4">
                    <span className="font-weight-bold text-muted">Файлов нет</span>
                </div>
            </div>

        }

        let loadingAppend = this.state.filesLoadAppend ? <div className="text-center mt-2">
            <Spinner variant="dark" animation="border" />
        </div> : null;

        return (
            <div className="p-2 flex-grow-1">

                <this.BreadСrumbs paths={this.state.paths} />

                <RenameFile renameId={this.state.renameId} setNullRenameId={this.setNullRenameId} />

                <DeleteFile deleteId={this.state.deleteId} setNullDeleteId={this.setNullDeleteId} />

                <ShowImage id={this.state.showImageId} changeImage={this.changeImage} closeShowImage={this.closeShowImage} />

                <div className="d-flex align-content-start flex-wrap">
                    {fileList}
                </div>

                {loadingAppend}

            </div>
        )

    }

}

export default withRouter(Files);