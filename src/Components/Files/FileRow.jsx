import React from 'react';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';

import * as Icons from './FileIcons'
import { Dropdown, Loader, Icon } from 'semantic-ui-react';

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

const downloadFile = file => {

    if (file.is_dir === 1)
        return null;

    const link = document.createElement('a');
    const url = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}/download`;
    const main_id = Cookies.get('main_id') || null;

    link.href = `${url}/${file.name}.${file.ext}?file=${file.id}&main_id=${main_id}`;
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}

function FileRow(props) {

    const { file, user, userId, setRenameFileId, showDeleteFile, loadingFile } = props;
    const { downloadArchive, createArchiveProcess } = props;
    const { audio } = props;
    const { setHide } = props;

    const icon = file.thumb_litle
        ? file.thumb_litle
        : Icons[file.icon] ?? Icons.file;

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

                <div className="audio-visualisation" id={`audio-visualisation-${file.id}`} style={{ display: audio === file.id ? 'flex' : 'none'}}></div>

                {file.icon === "video" && file.thumb_litle
                    ? <div className="video-play-start">
                        <span><Icon name="play" /></span>
                    </div>
                    : null
                }

                {file.hiden === 1
                    ? <div className="hiden-file" title="Скрыт от общего доступа"><Icon name="hide" /></div>
                    : null
                }

            </div>

            <div className="file-name-text">{name}</div>

        </div>

        <div id={`context-menu-${file.id}`} className="file-context-menu">
            {file.is_dir === 1 && !createArchiveProcess
                ? <Dropdown.Item
                    icon="download"
                    text="Скачать"
                    onClick={() => downloadArchive(file)}
                />
                : null
            }
            {file.is_dir === 0
                ? <Dropdown.Item
                    icon="download"
                    text="Скачать"
                    onClick={() => downloadFile(file)}
                />
                : null
            }
            {user === userId
                ? <Dropdown.Item
                    icon="pencil"
                    text="Переименовать"
                    onClick={() => setRenameFileId(file.id)}
                />
                : null
            }
            {user === userId
                ? <Dropdown.Item
                    icon={file.hiden === 1 ? "eye" : "hide"}
                    text={file.hiden === 1 ? "Общий доступ" : `Cкрыть ${file.is_dir === 0 ? 'файл' : 'каталог'}`}
                    onClick={() => setHide(file)}
                />
                : null
            }
            {user === userId
                ? <Dropdown.Item
                    icon="trash"
                    text="Удалить"
                    onClick={() => showDeleteFile(file)}
                />
                : null
            }
        </div>

        {loadingFile === file.id
            ? <div className="file-row-loading"><Loader active inline /></div>
            : null
        }

    </div>

}

const mapStateToProps = state => ({
    loadingFile: state.files.loadingFile,
    audio: state.players.audio,
    played: state.players.played,
    visual: state.players.visual,
});

export default connect(mapStateToProps)(FileRow);