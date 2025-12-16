import { useApp } from '@/hooks/useApp';
import useFetch from '@/hooks/useFetch';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button, Icon, IconGroup, Input, Modal } from 'semantic-ui-react';

const UploadYoutubeMusic = () => {

    const { folder } = useParams();
    const { isLoading, postJson } = useFetch();
    const { prependFile } = useApp();
    const [show, setShow] = useState(false);
    const [url, setUrl] = useState(null);

    const create = useCallback(() => {
        postJson('disk/download/autio', { url, folder }, (data) => {
            prependFile(data);
            setShow(false);
        })
    }, [url, folder]);

    useEffect(() => {
        if (!show) {
            setUrl(null);
        }
    }, [show]);

    return <div>
        <Modal
            onClose={() => setShow(false)}
            onOpen={() => setShow(true)}
            open={show}
            trigger={<Icon name="music" link size="large" fitted />}
            // trigger={<span
            //     className={`pi pi-youtube text-3xl opacity-50 hover:opacity-100 cursor-pointer text-red-600 relative`}
            //     title="Создать каталог"
            // />}
            header='Музыка из видео'
            size='tiny'
            centered={false}
            closeIcon
            content={<div className='content'>
                <div className='mb-6'>
                    <Input
                        placeholder="Введите ссылку на YouTube"
                        value={url || ""}
                        onChange={(e, { value }) => setUrl(value)}
                        fluid
                        required
                        loading={isLoading}
                    />
                </div>
                <div className='flex justify-end'>
                    <Button
                        color="green"
                        icon="plus"
                        content="Загрузить"
                        onClick={() => create()}
                        disabled={isLoading}
                    />
                </div>
            </div>}
        />
    </div>
}

export default UploadYoutubeMusic;