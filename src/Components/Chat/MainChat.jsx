import React from 'react';
import { connect } from 'react-redux';
import { updateMessagesList } from './../../store/chat/actions';

import './chat.css';
import Messages from './Messages';
import WriteMessage from './WriteMessage';

function MainChat(props) {

    const { updateMessagesList } = props;

    React.useEffect(() => {

        window.Echo.private('App.Disk.Chat')
            .listen('DiskChat', e => updateMessagesList(e.data));

        return () => window.Echo.leave('App.Disk.Chat');

    }, []);

    return <div className="main-chat">

        <Messages />
        <WriteMessage />

    </div>

}

const mapStateToProps = state => ({
    messages: state.chat.messages,
});

const mapDispatchToProps = {
    updateMessagesList,
}

export default connect(mapStateToProps, mapDispatchToProps)(MainChat);