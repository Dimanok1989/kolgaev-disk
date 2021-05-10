import React from 'react';
import * as Icon from './FileIcons'

import { Dropdown } from 'semantic-ui-react';

/**
 * Закрытие меню
 * @param {object} e event
 */
const fileMenuClose = e => {

    hideAllMenu();
    document.body.removeEventListener('click', fileMenuClose);

    // this.setState({ fileMenu: null });

}

/**
 * Скрытие всех открытых менюшек файла
 */
const hideAllMenu = () => {

    let elems = document.querySelectorAll(`.file-context-menu`);
    elems.forEach(elem => {
        elem.style.display = "none";
    });

    elems = document.querySelectorAll(`.files-list-row`);
    elems.forEach(elem => {
        elem.classList.remove("active-menu");
    });

}

/**
 * Открытие контекстного меню правой кнопкой мыши
 * @param {object} e event 
 */
const fileMenuOpen = e => {

    const id = e.currentTarget.dataset.file || null;

    e.preventDefault();
    document.body.addEventListener('click', fileMenuClose);

    hideAllMenu();
    const elem = document.getElementById(`context-menu-${id}`);

    elem.style.display = 'block';

    document.getElementById(`file-row-${id}`).classList.add('active-menu');

    let top = e.clientY,
        left = e.clientX,
        screenX = window.innerWidth,
        screenY = window.innerHeight,
        w = elem.offsetWidth,
        h = elem.offsetHeight,
        par = document.getElementById(`file-row-${id}`).getBoundingClientRect();

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

function FileRow(props) {

    const file = props.file;

    const icon = file.thumb_litle
        ? file.thumb_litle
        : Icon[file.icon] ?? Icon.file;

    if (file.empty) {
        return <div className="files-list-row files-list-row-empty">
            <div className="file-list-empty"></div>
        </div>
    }

    const name = file.name + (file.is_dir === 0 ? `.${file.ext}` : ``);

    return <div className="files-list-block-row">

        <div
            id={`file-row-${file.id}`}
            className="files-list-row"
            title={name}
            onClick={() => props.clickFile(file)}
            onContextMenu={fileMenuOpen}
            data-file={file.id}
        >

            <div className="d-flex justify-content-center align-items-center file-row-icon">
                <img src={icon} alt={`file_${file.id}`} />
            </div>

            <div className="file-name-text">{name}</div>

        </div>

        <div id={`context-menu-${file.id}`} className="file-context-menu">
            <Dropdown.Item icon="download" text="Скачать" />
            {/* <Dropdown.Item icon="pencil" text="Переименовать" />
            <Dropdown.Item icon="trash" text="Удалить" /> */}
        </div>

    </div>

}

export default FileRow;