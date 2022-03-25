import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader, Message } from "semantic-ui-react";
import { useActions } from "../../hooks/useActions";
import axios from "../../system/axios";

const Files = () => {

    const folder = useSelector(store => store.folder);
    const { setFiles } = useActions();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    const getFiles = useCallback(param => {

        setLoading(true);

        axios.post('disk/files/index', { ...param }).then(({ data }) => {

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

        </div>}

    </div>

}

export default Files;