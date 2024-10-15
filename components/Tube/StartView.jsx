
import useFetch from '@/hooks/useFetch';
import { useState, useEffect } from 'react';
import { Icon, Input } from "semantic-ui-react";
import { useRouter } from 'next/navigation'

const StartView = () => {

    const [url, setUrl] = useState(null);
    const [start, setStart] = useState(false);
    const { error, postJson } = useFetch();
    const router = useRouter();

    useEffect(() => {

        if (start) {
            postJson(
                'disk/video/start',
                { url },
                data => {
                    router.push(`/video/${data.uuid}`);
                },
                () => {
                    setStart(false);
                }
            );
        }

    }, [start]);

    return <div className="flex flex-col items-center justify-center my-3 px-3 max-w-[824px] mx-auto">
        <h3 className="w-full mb-1 px-1">Начни смотреть видео...</h3>
        <Input
            icon={<Icon
                name='play'
                link={Boolean(url) || start}
                disabled={!Boolean(url) || start}
                title="Начать просмотр"
                onClick={() => setStart(true)}
            />}
            placeholder="Введите ссылку на видео..."
            className="w-full"
            onChange={(e, { value }) => setUrl(value)}
            loading={start}
            disabled={start}
            value={url || ""}
            error={Boolean(error)}
            onKeyUp={e => e.keyCode === 13 && setStart(true)}
        />
        <div className="w-full mt-1">
            {error
                ? <strong className='text-red-600'>{error}</strong>
                : <span className="opacity-50">YouTube, VK, RuTube, Дзен</span>
            }
        </div>
    </div>
}

export default StartView;