import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../Utils/axios";

function MainPage(props) {

    const [rows, setRows] = useState([]);

    useEffect(() => {

        axios.post('disk/getLogs').then(({ data }) => {
            setRows(data.logs);
        });

    }, []);

    let date = 0;
    const logs = rows.map((row, k) => {

        let dateHead = null;

        if (date !== row.date) {
            dateHead = <div className="mt-3 w-100 text-left px-3 date-title-log">{row.date}</div>
            date = row.date;
        }

        let comment = null;

        if (row.type === "mkdir")
            comment = <span>создал каталог <Link to={`?user=${row.user_id}&folder=${row.file_id}`}><b>{row.file}</b></Link></span>
        else if (row.type === "upload")
            comment = <span>загрузил файл <b>{row.file}</b></span>
        else if (row.type === "uploads")
            comment = <span>загрузил <b>{row.count}</b> файлов в каталог <Link to={`?user=${row.user_id}&folder=${row.file_id}`}><b>{row.file}</b></Link></span>

        return <div key={k}>

            {dateHead}

            <div className="w-100 text-left px-3 mt-2 d-flex">

                <span className="mr-3 time-log">{row.time}</span>
                <div className="flex-grow-1">
                    <strong className="mr-1">{row.user}</strong>
                    {comment}
                </div>

            </div>

        </div>

    });

    return <div className="py-3 px-2 flex-grow-1 text-center text-muted">

        <div className="mt-1 date-title-log">Добро пожаловать в файловый менеджер!</div>
        <div className="mb-4"><small>Чтобы просмотреть файлы, выберите пользователя в меню слева</small></div>

        {logs}

    </div>

}

export default MainPage;