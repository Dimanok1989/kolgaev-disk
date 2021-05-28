import React from 'react';
import { connect } from 'react-redux';
import { setMessagesList } from './../../store/chat/actions';

import axios from './../../system/axios';

import { Icon, Loader } from 'semantic-ui-react';

function Messages(props) {

    const { messages, user } = props;
    const { setMessagesList } = props;

    const chat = React.useRef(null);
    const [loading, setLoading] = React.useState(true);
    const [process, setProcess] = React.useState(true);
    const [page, setPage] = React.useState(1);
    const [endMessages, setEndMessages] = React.useState(false);

    React.useEffect(() => {

        if (process) {

            setLoading(true);

            axios.post('disk/getMessages', { page }).then(({ data }) => {

                let chatMessages = [...messages];
                data.messages.forEach(row => {
                    chatMessages.push(row);
                });

                setMessagesList(chatMessages);

                setPage(page + 1);

                if (data.lastPage < data.nextPage)
                    setEndMessages(true);

            }).catch(error => {

            }).then(() => {
                setLoading(false);
                setProcess(false);
            });

        }

    }, [process]);

    React.useEffect(() => {

        const scrollHandler = e => {

            let scrollHeight = e.target.scrollHeight,
                scrollTop = e.target.scrollTop,
                innerHeight = e.target.offsetHeight;

            let scroll = scrollHeight + (scrollTop - innerHeight);

            if (Math.abs(scroll) < 100 && !process && !endMessages) {
                setProcess(true);
            }

        }

        chat.current.addEventListener('scroll', scrollHandler);

        return () => {
            if (chat.current)
                chat.current.removeEventListener('scroll', scrollHandler);
        }

    }, [process, endMessages]);

    return <div className="chat-messages" ref={chat}>

        {loading
            ? <div className="loading-messages"><Loader inline active size="tiny" /></div>
            : null
        }

        {messages.map((msg, i) => {

            let classList = ['message-row'];

            if (msg.user_id === null)
                classList.push("message-system");
            else if (msg.user_id === user.id)
                classList.push("message-my-row");
            else
                classList.push("message-to-me");

            let icon = null;

            if (msg.status === "create")
                icon = "clock";
            else if (msg.status === "error") {
                icon = "warning sign";
                classList.push("message-error");
            }
            else if (msg.status === "sent")
                icon = "check";

            let message = msg.message ? msg.message.split('\n') : [];

            return <div key={i} className={classList.join(" ")}>

                <div className="message-row-content">

                    {msg.user_id === null
                        ? <div className="message-title">
                            <img src="/logo.svg" alt="System message" />
                            {msg.title
                                ? <span title={msg.title}><b>{msg.title}</b></span>
                                : <span title="Системное сообщение"><b>Kolgaev.ru</b> Диск</span>
                            }
                        </div>
                        : null
                    }

                    {msg.user_id !== user.id
                        ? <div className="message-author">{msg.name}</div>
                        : null
                    }

                    <div className="message-text">{message.map((item, index) => {
                        return (index === 0) ? item : [<br key={index} />, item]
                    })}</div>

                    <div className="message-date">
                        <small>{msg.date}</small>
                        {icon ? <Icon name={icon} /> : null}
                    </div>

                </div>

            </div>

        })}

    </div>;

}

const mapStateToProps = state => ({
    messages: state.chat.messages,
    user: state.main.user,
});

const mapDispatchToProps = {
    setMessagesList,
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);