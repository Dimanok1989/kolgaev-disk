import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { selectUser } from './../store/users/actions';
import { setShowCreateFolder, setFilesList, setOpenFolder } from './../store/files/actions';

import { Button, Icon, Popup } from 'semantic-ui-react';

import { openInput } from './Uploads/UploadsMain';

function UploadsMain(props) {

    const { selectUser, user, userId, uploadProcess, setShowCreateFolder } = props;

    const openMenu = () => {

        const menu = document.getElementById('main-menu');
        menu.style.left = 0;

        const bg = document.getElementById('main-menu-bg');
        bg.style.display = "block";

        menu.addEventListener('click', closeMenu);
        bg.addEventListener('click', closeMenu);

    }

    const closeMenu = () => {
        
        const menu = document.getElementById('main-menu');
        menu.style.left = '-200px';

        const bg = document.getElementById('main-menu-bg');
        bg.style.display = "none";

        menu.removeEventListener('click', closeMenu);
        bg.removeEventListener('click', closeMenu);

    }

    return <div className="main-header">

        <div className="main-menu-bg" id="main-menu-bg"></div>

        <div className="header-content d-flex justify-content-between align-items-center">

            <div className="d-flex align-items-center">

                <Icon
                    name="bars"
                    className="show-menu"
                    size="large"
                    onClick={openMenu}
                />

                <Link to="/" className="header-main-link" onClick={() => {
                    selectUser(null);
                    props.setFilesList([]);
                    props.setOpenFolder(null);
                }}>
                    <img src="/favicon.ico" alt="Главная страница" />
                    <b>Kolgaev.ru</b>
                    <span>Диск</span>
                </Link>

            </div>

            <div>
                <Button.Group icon basic size="tiny">
                    <Popup
                        content="Создать папку"
                        inverted
                        size="mini"
                        trigger={<Button onClick={() => setShowCreateFolder(true)} disabled={user?.id && user.id === userId ? false : true}>
                            <Icon name="folder" />
                        </Button>}
                    />
                    <Popup
                        content="Загрузить файлы в каталог"
                        inverted
                        size="mini"
                        trigger={<Button onClick={openInput} disabled={user?.id && user.id === userId ? (uploadProcess ? true : false) : true}>
                            <Icon name="upload" />
                        </Button>}
                    />
                </Button.Group>
            </div>

        </div>
    </div>

}

const mapStateToProps = state => ({
    user: state.main.user,
    userId: state.users.selectedUser,
    uploadProcess: state.uploads.uploadProcess,
});

const mapDispatchToProps = {
    selectUser, setShowCreateFolder, setFilesList, setOpenFolder
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadsMain);