import React from 'react';

import axios from './../../Utils/axios';
// import echoerror from './../../Utils/echoerror';

import RenameFile from './RenameFile';

import { Spinner, Card, Dropdown } from 'react-bootstrap';
import Icons from '../../Utils/Icons';
import FontAwesomeIcon from './../../Utils/FontAwesomeIcon';

class Files extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            user: null,
            files: [],
            dirs: [],
            filesLoad: true,
            cd: "",
            paths: [],
            newFile: null,
            fileMenu: null,
            renameId: null,
        }

    }

    componentDidMount() {

        if (this.props.user)
            this.getUserFiles(this.props.user); // Получение списка файлов
        else if (!this.props.user) {
            this.setState({ filesLoad: false });
        }

    }

    componentDidUpdate = (prevProps) => {

        // Отслеживание изменений значения идентификатора пользователя
        if (prevProps.user !== this.props.user) {

            this.setState({ user: this.props.user });

            // Провека ссылки для папки
            const query = new URLSearchParams(window.location.search);

            // Получение списка файлов
            this.getUserFiles(this.props.user, query.get('folder') || null);

        }

        // Добавление нового файла
        if (prevProps.newFile != this.props.newFile) {

            let files = this.state.files;
            files.push(this.props.newFile);

            this.setState({
                files,
                newFile: null
            });

        }

    }

    /**
     * Открытие папки с файлами
     * @param {object} e event 
     */
    openFolder = e => {

        // Папка к открытию
        let folder = e.currentTarget.dataset.folder || null,
            user = this.state.user,
            data = {},
            url = `?user=${user}`;

        data.user = user;

        if (folder) {
            data.folder = folder;
            url += `&folder=${folder}`;
        }

        window.history.pushState(data, `Файлы ${data.user} в папке ${data.folder}`, url);

        this.getUserFiles(this.state.user, folder);

    }

    /**
     * Загрузка списка файлов одного пользователя
     * @param {number} user идентификатор пользователя
     * @param {number|null} folder идентификатор папки с файлами
     */
    getUserFiles = (user, folder = null) => {

        let formData = new FormData();
        formData.append('id', user);

        // Файлы в папке
        if (folder)
            formData.append('folder', folder);

        this.props.setFolderId(folder);

        // Анимация загрузки
        this.setState({
            filesLoad: true,
        });

        axios.post('disk/getUserFiles', formData).then(({ data }) => {

            this.setState({
                files: data.files,
                dirs: data.dirs,
                cd: data.cd,
                paths: data.paths,
            });

        }).catch(error => { }).then(() => {

            this.setState({
                filesLoad: false,
            });

        });

    }

    renameFile = e => {

        let renameId = Number(e.currentTarget.dataset.file);
        this.setState({ renameId });

    }

    /**
     * Открытие контекстного меню правой кнопкой мыши
     * @param {object} e event 
     */
    fileMenuOpen = e => {

        e.preventDefault();
        this.setState({ fileMenu: e.currentTarget.dataset.file });

        document.body.addEventListener('click', this.fileMenuClose);

        this.hideAllMenu();
        let elem = document.getElementById(`context-menu-${e.currentTarget.dataset.file}`);
        elem.style.display = 'block';

        let top = e.clientY,
            left = e.clientX,
            screenX = window.innerWidth,
            screenY = window.innerHeight,
            w = elem.offsetWidth,
            h = elem.offsetHeight,
            par = document.getElementById(`file-row-${e.currentTarget.dataset.file}`).getBoundingClientRect();

        if (w + left > screenX)
            left = screenX - w - 20;

        if (h + top > screenY)
            top = screenY - h - 10;

        // console.log({ top, left, screenX, screenY, w, h, par });

        left = left - par.x;
        top = top - par.y;

        elem.style.top = `${top}px`;
        elem.style.left = `${left}px`;

    }

    /**
     * Скрытие всех открытых менюшек файла
     */
    hideAllMenu = () => {

        let elems = document.querySelectorAll(`.file-context-menu`);
        elems.forEach(elem => {
            elem.style.display = "none";
        });

    }

    /**
     * Закрытие меню
     * @param {object} e event
     */
    fileMenuClose = e => {

        this.hideAllMenu();
        document.body.removeEventListener('click', this.fileMenuClose);

        this.setState({ fileMenu: null });

    }

    /**
     * Формирование контекстного меню
     * @param {object} file объект данных файла 
     */
    FileMenu = ({ filedata }) => {

        let classes = "py-1 px-3 item-file-menu";

        // Пункт переименовывания файла
        let rename = <Dropdown.Item className={classes} onClick={this.renameFile} data-file={filedata.id}>
            <div className="d-inline-block text-left icon-item-menu-file">
                <FontAwesomeIcon icon={["fas", "pen"]} />
            </div>
            <span>Переименовать</span>
        </Dropdown.Item>;

        return (
            <Card className="position-absolute shadow py-1 file-context-menu" id={`context-menu-${filedata.id}`}>
                {rename}
            </Card>
        )

    }

    /**
     * Метод вывода хлебных крошек
     * @param {object} paths 
     */
    BreadСrumbs = ({ paths }) => {

        // Главный каталог пользователя
        if (!paths.length)
            return <div className="px-2">
                <strong>Файлы</strong>
            </div>;

        let folders = null, // Каталоги для вывода крошек
            last = null, // Текущий откртый каталог
            crumbs = [], // Крошки для вывода
            count = 1; // Счетчик крошек

        // Сборка данных
        paths.forEach(path => {

            // Определение текущего каталога
            if (count == paths.length) {
                last = <div className="px-2">
                    <strong>{path.name}</strong>
                </div>
            }
            else {
                crumbs.push(path);
            }

            count++;

        });

        // Вывод крошек
        folders = crumbs.map(crumb => (
            <button className="btn btn-link btn-sm" type="button" onClick={this.openFolder} data-folder={crumb.id} key={crumb.id}>
                <span className="mr-1">{crumb.name}</span>
                <FontAwesomeIcon icon={["fas", "angle-right"]} />
            </button>
        ));

        return (
            <div>
                <button className="btn btn-link btn-sm" type="button" onClick={this.openFolder}>
                    <span className="mr-1">Файлы</span>
                    <FontAwesomeIcon icon={["fas", "angle-right"]} />
                </button>
                {folders}
                {last}
            </div>
        )

    }

    /**
     * Вывод одной строки файла
     * @param {object} file
     * @return {object}
     */
    FileRowList = ({ file }) => {

        let name = file.name,
            icon = Icons.file;

        // Добавление расширения файла к имени
        if (!file.is_dir)
            name += `.${file.ext}`;

        if (file.icon)
            icon = Icons[file.icon];

        let onClick = file.is_dir ? this.openFolder : this.selectFile;

        let classes = "py-1 px-3 item-file-menu";

        // Пункт переименовывания файла
        let rename = <Dropdown.Item className={classes} onClick={this.renameFile} data-file={file.id}>
            <div className="d-inline-block text-left icon-item-menu-file">
                <FontAwesomeIcon icon={["fas", "pen"]} />
            </div>
            <span>Переименовать</span>
        </Dropdown.Item>;

        const menu = (
            <Card className="position-absolute shadow py-1 file-context-menu" id={`context-menu-${file.id}`}>
                {rename}
            </Card>
        )

        return <div className="position-relative" id={`file-row-block-${file.id}`}>

            <div className="loading-app loading-modal justify-content-center align-items-center position-absolute h-100 loading-file">
                <Spinner animation="border" />
            </div>

            <Card className="file-row border-0 text-center m-1 p-1" title={name} onClick={onClick} data-folder={file.id} onContextMenu={this.fileMenuOpen} data-file={file.id} id={`file-row-${file.id}`}>
                <div className="d-flex justify-content-center align-items-center file-row-icon">
                    <img src={icon} width="46" height="46" alt={file.name} />
                </div>
                <div className="file-row-name">{name}</div>
            </Card>

            {menu}

        </div>

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
            <this.FileRowList file={file} key={file.id} />
        ));

        if (!files.length) {

            fileList = <div className="py-3 px-2 flex-grow-1">
                <div className="text-center pt-4">
                    <span className="font-weight-bold text-muted">Файлов нет</span>
                </div>
            </div>

        }

        return (
            <div className="py-3 px-2 flex-grow-1">

                <this.BreadСrumbs paths={this.state.paths} />
                <RenameFile renameId={this.state.renameId} setNullRenameId={this.setNullRenameId} />

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

export default Files;
