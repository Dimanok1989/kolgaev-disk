import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Icon, Loader, Message } from "semantic-ui-react";
import { useActions } from "../../hooks/useActions";
import { axios } from "../../system";

const Files = () => {

    const { files } = useSelector(store => store.folder);
    const { setFiles } = useActions();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    const getFiles = useCallback(param => {

        setLoading(true);

        axios.get('disk/files', { ...param }).then(({ data }) => {

            setError(null);

        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    useEffect(() => {
        getFiles({ page: 1 });
        // eslint-disable-next-line
    }, []);

    return <div>

        {loading && <Loader inline="centered" active className="mt-4" />}

        {!loading && <div className="body-content">

            {error && <Message error content={error} className="mt-3" />}

            {typeof files == "object" && files.length === 0 && <div className="text-center my-5 opacity-60">
                <div><b>Файлов еще нет</b></div>
                <small>Перетащите сюда файл или используйте кнопку <Icon name="upload" fitted /></small>
            </div>}

        </div>}

    </div>

}

export default Files;