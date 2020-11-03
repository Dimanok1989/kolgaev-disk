import React from 'react';

import axios from './../../Utils/axios';
import echoerror from './../../Utils/echoerror';

import { Spinner, CardColumns, Card } from 'react-bootstrap';
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
        if (prevProps.user != this.props.user) {

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

        let formData = new FormData;
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

    /**
     * Вывод одной строки файла
     * @param {object} file
     * @return {object}
     */
    FileRowList = ({ file }) => {

        let name = file.name,
            icon = Icons.file;

        if (!file.is_dir)
            name += `.${file.ext}`;

        if (file.icon)
            icon = Icons[file.icon];

        let onClick = file.is_dir ? this.openFolder : this.selectFile;

        return <Card className="file-row border-0 text-center m-1 p-1" title={name} onClick={onClick} data-folder={file.id}>
            <div className="d-flex justify-content-center align-items-center file-row-icon">
                <img src={icon} width="46" height="46" />
            </div>
            <div className="file-row-name">{name}</div>
        </Card>


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
                <div className="d-flex align-content-start flex-wrap">
                    {fileList}
                </div>
            </div>
        )

    }

}

export default Files;
