import React from 'react';

import { Spinner, Card, Dropdown } from 'react-bootstrap';
import Icons from './../../../Utils/Icons';
import FontAwesomeIcon from './../../../Utils/FontAwesomeIcon';

class FileRowList extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            fileMenu: null,
        }

    }

    componentWillUnmount = () => null;

    /**
     * Открытие папки с файлами
     * 
     * @param {object} e event 
     */
    openFolder = e => {

        // Папка к открытию
        let folder = e.currentTarget.dataset.folder || null,
            user = this.props.user,
            data = {},
            url = `?user=${user}`;

        data.user = user;

        if (folder) {
            data.folder = folder;
            url += `&folder=${folder}`;
        }

        this.props.openFolder(folder, url);

    }

    /**
     * Скрытие всех открытых менюшек файла
     */
    hideAllMenu = () => {

        let elems = document.querySelectorAll(`.file-context-menu`);
        elems.forEach(elem => {
            elem.style.display = "none";
        });

        elems = document.querySelectorAll(`.file-row`);
        elems.forEach(elem => {
            elem.classList.remove("active-menu");
        });

    }

    /**
     * Открытие контекстного меню правой кнопкой мыши
     * 
     * @param {object} e event 
     */
    fileMenuOpen = e => {

        e.preventDefault();

        let fileid = e.currentTarget.dataset.file;
        this.setState({ fileMenu: fileid });

        document.body.addEventListener('click', this.fileMenuClose);

        this.hideAllMenu();
        let elem = document.getElementById(`context-menu-${fileid}`);
        elem.style.display = 'block';

        document.getElementById(`file-row-${fileid}`).classList.add('active-menu');

        let top = e.clientY,
            left = e.clientX,
            screenX = window.innerWidth,
            screenY = window.innerHeight,
            w = elem.offsetWidth,
            h = elem.offsetHeight,
            par = document.getElementById(`file-row-${fileid}`).getBoundingClientRect();

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
     * Закрытие меню
     * @param {object} e event
     */
    fileMenuClose = e => {

        this.hideAllMenu();
        document.body.removeEventListener('click', this.fileMenuClose);

        this.setState({ fileMenu: null });

    }

    /**
     * Вызов модального окна смены имени файла
     * @param {object} e event 
     */
    renameFile = e => {

        let renameId = Number(e.currentTarget.dataset.file);
        this.props.renameFile(renameId);

    }

    /**
     * Скачивание файла
     */
    downloadFile = e => {

        let id = Number(e.currentTarget.dataset.file),
            dir = Number(e.currentTarget.dataset.dir);

        this.props.downloadFile(id, dir);

    }

    deleteFile = e => {

        let id = Number(e.currentTarget.dataset.file);
        this.props.deleteFile(id);

    }

    render() {

        const file = this.props.file;

        let name = file.name,
            icon = Icons.file;

        // Добавление расширения файла к имени
        if (!file.is_dir)
            name += `.${file.ext}`;

        if (file.icon)
            icon = Icons[file.icon];

        let classes = "py-1 px-3 item-file-menu";
        file.iconClassName = "file-row-icon-image";

        if (file.thumb_litle) {
            icon = file.thumb_litle;
            file.iconClassName = "file-row-icon-thumbnail";
        }

        // Пункт меню скачать
        let download = <Dropdown.Item className={classes} onClick={this.downloadFile} data-file={file.id} data-dir={file.is_dir}>
            <div className="d-inline-block text-left icon-item-menu-file">
                <FontAwesomeIcon icon={["fas", "download"]} />
            </div>
            <span>Скачать</span>
        </Dropdown.Item>;

        // Пункт переименовывания файла
        let rename = (Number(localStorage.getItem('user')) === this.props.user) ? <Dropdown.Item className={classes} onClick={this.renameFile} data-file={file.id}>
            <div className="d-inline-block text-left icon-item-menu-file">
                <FontAwesomeIcon icon={["fas", "pen"]} />
            </div>
            <span>Переименовать</span>
        </Dropdown.Item> : null;

        // Пункт удаления файла
        let del = (Number(localStorage.getItem('user')) === this.props.user) ? <Dropdown.Item className={classes} onClick={this.deleteFile} data-file={file.id}>
            <div className="d-inline-block text-left icon-item-menu-file">
                <FontAwesomeIcon icon={["fas", "trash"]} />
            </div>
            <span>Удалить</span>
        </Dropdown.Item> : null;

        const menu = (
            <Card className="position-absolute shadow py-1 file-context-menu" id={`context-menu-${file.id}`}>
                {download}
                {rename}
                {del}
            </Card>
        )

        let onClick = file.is_dir ? this.openFolder : this.selectFile;

        if (file.thumb_litle)
            onClick = this.props.showImage

        let content = <div>
            <div className="mx-auto d-flex justify-content-center align-items-center file-row-icon">
                <img src={icon} alt={file.name} className={file.iconClassName} />
            </div>
            <div className="file-row-name">{name}</div>
        </div>

        return <div className="position-relative" id={`file-row-block-${file.id}`}>

            <div className="loading-app loading-modal justify-content-center align-items-center position-absolute h-100 loading-file">
                <Spinner animation="border" />
            </div>

            <Card
                id={`file-row-${file.id}`}
                className="file-row border-0 text-center m-1 p-1"
                title={name}
                onClick={onClick}
                onContextMenu={this.fileMenuOpen}
                data-file={file.id}
                data-folder={file.id}
            >
                {content}
            </Card>

            {menu}

        </div>

    }

}

export default FileRowList;