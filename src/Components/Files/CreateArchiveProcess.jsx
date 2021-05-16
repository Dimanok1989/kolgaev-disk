import React from 'react';
import { Progress, Icon } from 'semantic-ui-react';

function CreateArchiveProcess(props) {

    const { process, completeCreate, setCompleteCreate, setCreateProcess } = props;

    if (!process)
        return null;

    let bar = "red",
        active = true,
        message = "Неизвестная ошибка",
        color = "#000000";

    if (process === true) {
        bar = "blue";
        color = "#ffffff";
        message = "Поиск файлов в каталоге...";
    }
    else if (process === "completed") {
        bar = "green";
        color = "#ffffff";
        active = false;
        message = "Сейчас начнется скачивание архива";
    }
    else if (process?.size) {
        bar = "yellow";
        message = `Архивация файлов (${process.size})`;
    }
    else if (process) {
        color = "#ffffff";
        message = process;
        active = false;
    }

    return <div className="create-archive-process">
        <Progress percent={100} active={active} className="progress-bar-create-archive" color={bar} />
        <div className="message-create-process" style={{ color: color }}>{message}</div>
        {completeCreate ? <div className="create-complete-close" onClick={() => {
            setCompleteCreate(null);
            setCreateProcess(null);
        }}><Icon name="times" style={{ color: color }} /></div> : null}
    </div>

}

export default CreateArchiveProcess;