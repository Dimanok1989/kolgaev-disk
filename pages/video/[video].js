import Video from "@/components/Player/Video";
import useFetch from "@/hooks/useFetch";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { STATUS_DONE } from ".";
import VideoProgress from "@/components/Player/VideoProgress";
import Head from "next/head";
import { APP_NAME } from "../_app";
import { useResize } from "@/hooks/useResize";
import Extractor from "@/components/Tube/Extractor";

export function getDateTime(str = null) {
    const date = new Date(str);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours() + 1).padStart(2, '0');
    const minut = String(date.getMinutes() + 1).padStart(2, '0');
    return `${day}.${month}.${year} ${hour}:${minut}`;
}

const YoutTube = () => {

    const { video } = useParams();
    const { isLoading, getJson } = useFetch();
    const [data, setData] = useState(null);

    const player = useRef();
    const windowWidth = useResize();
    const [height, setHeight] = useState("56.25%");

    useEffect(() => {
        if (player.current?.offsetWidth) {
            setHeight(player.current.offsetWidth * (9 / 16));
        }
    }, [windowWidth]);

    useEffect(() => {
        if (video) {
            getJson(`disk/video/get/${video}`, null, response => {
                setData(response);
            });
        }
    }, [video]);

    const title = Boolean(data?.title) ? data.title : "Подготовка видео...";

    return <>

        <Head>
            <title>{title} | {APP_NAME}</title>
        </Head>

        <div className="w-full bg-black">

            <div className="w-full max-w-screen-xl mx-auto bg-gray-900" ref={player} style={{ height }}>

                {(data && data?.status === STATUS_DONE) && <Video
                    id={data.uuid}
                    length={data.duration}
                    title={data.title}
                    files={data.files}
                />}

                {(data && data?.status !== STATUS_DONE) && <VideoProgress
                    data={data}
                    setData={setData}
                />}

            </div>

        </div>

        {data?.title && <div className="mt-4 px-2 sm:px-0 max-w-screen-xl mx-auto">
            <div className="px-3">
                <h1 className="text-[18px] mb-0">{data?.title}</h1>
                {data?.channel_url && <a href={data.channel_url} target="_blank">
                    <strong>{data?.channel || data.channel_url}</strong>
                </a>}
                <div className="mt-2">
                    <Extractor extractor={data?.extractor} />
                </div>
            </div>
            {data?.description && <div className="bg-white rounded-lg px-3 py-4 cursor-default">
                {data?.publish_date && <div className="mb-5" title="Дата публикации">
                    <strong>{getDateTime(data.publish_date)}</strong>
                </div>}
                <p dangerouslySetInnerHTML={{ __html: data?.description }} />
            </div>}
        </div>}

    </>
}

export default YoutTube;