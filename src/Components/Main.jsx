import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setOnlineUsers, setOnlineUserJoining, setOnlineUserLeaving } from './../store/users/actions';

import './../css/main.css';

import MainMenu from './MainMenu';
import FilesContent from './Files/Files';
import UploadsMain from './Uploads/UploadsMain';
import CreateFolder from './Files/CreateFolder';
import CreateArchive from './Files/CreateArchive';
import MainChat from './Chat/MainChat';

function Main(props) {

    const { setOnlineUsers, setOnlineUserJoining, setOnlineUserLeaving } = props;

    const content = props?.match?.params?.id
        ? <FilesContent />
        : <MainChat />

    window.Echo.join('App.Disk')
        .here(users => setOnlineUsers(users))
        .joining(user => setOnlineUserJoining(user))
        .leaving(user => setOnlineUserLeaving(user));

    return <div>

        <div className="main-content py-3">
            <MainMenu />
            {content}
        </div>

        <UploadsMain />
        <CreateFolder />

        <CreateArchive />

    </div>

}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
    setOnlineUsers,
    setOnlineUserJoining,
    setOnlineUserLeaving,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));