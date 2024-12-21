import { useApp } from '@/hooks/useApp';
import useFetch from '@/hooks/useFetch';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button, Icon, IconGroup, Input, Modal } from 'semantic-ui-react';

const CreateFolderModal = () => {

    const { folder } = useParams();
    const { isLoading, postJson } = useFetch();
    const { prependFile } = useApp();
    const [show, setShow] = useState(false);
    const [name, setName] = useState(null);

    const create = useCallback(() => {
        postJson('disk/folder', { name, folder }, (data) => {
            prependFile(data);
            setShow(false);
        })
    }, [name, folder]);

    useEffect(() => {
        if (!show) {
            setName(null);
        }
    }, [show]);

    return <div>
        <Modal
            onClose={() => setShow(false)}
            onOpen={() => setShow(true)}
            open={show}
            trigger={<span
                className={`pi pi-folder-plus text-3xl opacity-50 hover:opacity-100 cursor-pointer`}
            />}
            header='Новый каталог'
            size='tiny'
            centered={false}
            closeIcon
            content={<div className='content'>
                <div className='mb-6'>
                    <Input
                        placeholder="Введите имя каталога"
                        value={name || ""}
                        onChange={(e, { value }) => setName(value)}
                        fluid
                        required
                        loading={isLoading}
                    />
                </div>
                <div className='flex justify-end'>
                    <Button
                        color="green"
                        icon="plus"
                        content="Создать"
                        onClick={() => create()}
                        disabled={isLoading}
                    />
                </div>
            </div>}
        />
    </div>
}

export default CreateFolderModal;