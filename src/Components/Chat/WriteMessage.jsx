import React from 'react';
import { connect } from 'react-redux';
import { setMessagesList, updateMessagesList } from './../../store/chat/actions';

import axios from './../../system/axios';

var _buffer;

function countLines(textarea) {

    if (_buffer == null) {
        _buffer = document.createElement('textarea');
        _buffer.style.border = 'none';
        _buffer.style.height = '0';
        _buffer.style.overflow = 'hidden';
        _buffer.style.padding = '0';
        _buffer.style.position = 'absolute';
        _buffer.style.left = '0';
        _buffer.style.top = '0';
        _buffer.style.zIndex = '-1';
        document.body.appendChild(_buffer);
    }

    var cs = window.getComputedStyle(textarea);
    var pl = parseInt(cs.paddingLeft);
    var pr = parseInt(cs.paddingRight);
    var lh = parseInt(cs.lineHeight);

    // [cs.lineHeight] may return 'normal', which means line height = font size.
    if (isNaN(lh))
        lh = parseInt(cs.fontSize);

    // Copy content width.
    _buffer.style.width = (textarea.clientWidth - pl - pr) + 'px';

    // Copy text properties.
    _buffer.style.font = cs.font;
    _buffer.style.letterSpacing = cs.letterSpacing;
    _buffer.style.whiteSpace = cs.whiteSpace;
    _buffer.style.wordBreak = cs.wordBreak;
    _buffer.style.wordSpacing = cs.wordSpacing;
    _buffer.style.wordWrap = cs.wordWrap;

    // Copy value.
    _buffer.value = textarea.value;

    var result = Math.floor(_buffer.scrollHeight / lh);

    if (result === 0)
        result = 1;

    return result;

}

function WriteMessage(props) {

    const { updateMessagesList } = props;
    const { user } = props;

    const textarea = React.useRef(null);
    const [message, setMessage] = React.useState(null);

    const [rows, setRows] = React.useState(1);
    const rowsMax = 8;

    const [send, setSend] = React.useState(false);

    const changeMessage = value => {

        setMessage(value);

        let lines = countLines(textarea.current);

        if (lines !== rows) {
            setRows(lines);
            textarea.current.scrollTop = textarea.current.scrollHeight - textarea.current.clientHeight;
        }

    }

    const keyDown = e => {

        if (e.keyCode === 13 && e.ctrlKey) {
            changeMessage(textarea.current.value += "\n");
            textarea.current.scrollTop = textarea.current.scrollHeight - textarea.current.clientHeight;
        }
        else if (e.keyCode === 13) {
            e.preventDefault();
            setSend(true);
        }

    }

    React.useEffect(() => {

        const getDate = date => {

            let hour = date.getHours(),
                minute = date.getMinutes();

            return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

        }

        if (send) {

            let date = new Date();
            let microtime = date.getTime();

            let msg = {
                id: microtime,
                user_id: user.id,
                message: message,
                name: `${user.name}${(user.surname ? ` ${user.surname}` : ``)}`,
                status: "create",
                date: getDate(date),
            }

            updateMessagesList({
                new: msg
            });

            axios.post('disk/sendMessage', {
                message,
                microtime
            }).then(({ data }) => {

                updateMessagesList({
                    update: data.message,
                    id: microtime,
                });

            }).catch(error => {

                msg.status = "error";
                msg.error = axios.getError(error);

                updateMessagesList({
                    update: msg,
                    id: microtime,
                });

            });

            setMessage("");
            setRows(1);

        }

        return () => setSend(false);

    }, [send]);

    return <div className="chat-write-message">

        <textarea
            ref={textarea}
            className="write-message"
            placeholder="Написать сообщение..."
            name="message"
            value={message || ""}
            onChange={e => changeMessage(e.target.value)}
            rows={rows <= rowsMax ? rows : rowsMax}
            autoFocus
            onKeyDown={keyDown}
        />

    </div>

}

const mapStateToProps = state => ({
    messages: state.chat.messages,
    user: state.main.user,
});

const mapDispatchToProps = {
    setMessagesList,
    updateMessagesList,
}

export default connect(mapStateToProps, mapDispatchToProps)(WriteMessage);