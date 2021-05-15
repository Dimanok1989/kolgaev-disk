import { connect } from 'react-redux';
import { setOnlineUsers, setOnlineUserJoining, setOnlineUserLeaving } from './../store/users/actions'

import './../css/main.css';

import MainMenu from './MainMenu';
import FilesContent from './Files/Files';
import UploadsMain from './Uploads/UploadsMain';
import CreateFolder from './Files/CreateFolder';

function Main(props) {

    const { setOnlineUsers, setOnlineUserJoining, setOnlineUserLeaving } = props;

    window.Echo.join('App.Disk')
        .here(users => setOnlineUsers(users))
        .joining(user => setOnlineUserJoining(user))
        .leaving(user => setOnlineUserLeaving(user));

    return <div>

        <div className="main-content py-3">
            <MainMenu />
            <FilesContent />
        </div>

        <UploadsMain />
        <CreateFolder />

    </div>

}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
    setOnlineUsers, setOnlineUserJoining, setOnlineUserLeaving
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);