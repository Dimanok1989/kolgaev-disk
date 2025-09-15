import { useEffect, useState } from "react";
import { Button, Dropdown, Modal } from "semantic-ui-react";
import useAxios from "./useAxios";
import { getError } from "./useFetch";
import { Message } from 'primereact/message';

export default function useFileShare() {

    const { axios } = useAxios();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [options, setOptions] = useState([]);
    const [users, setUsers] = useState([]);
    const [save, setSave] = useState(false);

    useEffect(() => {

        if (file) {
            axios.get(`disk/public/${file.id}`)
                .then(({ data }) => {
                    setError(null);
                    setOptions(data.map(user => ({
                        key: user.id,
                        value: user.id,
                        text: user.fullname,
                        image: user.avatar ? {
                            avatar: true,
                            src: user.avatar,
                        } : null,
                    })))
                })
                .catch(e => {
                    setError(getError(e));
                })
                .then(() => {
                    setLoading(false);
                });
        }

        return () => {
            setLoading(true);
            setError(null);
            setUsers([]);
            setSave(false);
        }

    }, [file]);

    useEffect(() => {

        if (save) {
            axios.post(`disk/public/${file.id}`)
                .then(({ data }) => {
                    setSave(false);
                    setFile(null);
                })
        }

    }, [save]);

    return {
        selectShareFile: setFile,
        FileShare: <Modal
            open={Boolean(file?.id)}
            onClose={() => setFile(null)}
            closeOnDimmerClick={false}
            header={`Общий доступ`}
            centered={false}
            closeIcon={true}
            size="small"
            content={<div className="content">

                <Dropdown
                    placeholder='Выберите приятелей'
                    closeOnEscape
                    selection
                    options={options}
                    fluid
                    loading={loading}
                    disabled={loading || Boolean(error) || save}
                    multiple
                    onChange={(e, { value }) => setUsers(value)}
                />

                {!loading && error && <Message severity="error" text={error} className='w-full mt-3' />}

                <div className="mt-3">
                    <div className="flex justify-end">
                        <Button
                            disabled={users.length === 0 || Boolean(error) || save}
                            color="green"
                            icon="save"
                            content="Сохранить"
                            loading={save}
                            onClick={() => setSave(true)}
                        />
                    </div>
                </div>
            </div>}
        />,
    }
}