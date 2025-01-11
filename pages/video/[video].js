import Video from "@/components/Player/Video";
import useFetch from "@/hooks/useFetch";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { STATUS_DONE } from ".";
import VideoProgress from "@/components/Player/VideoProgress";
import Head from "next/head";
import { APP_NAME } from "../_app";
import { useResize } from "@/hooks/useResize";

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

        <div className="mt-4 px-2 sm:px-0 max-w-screen-xl mx-auto">
            <h1 className="text-[18px]">{data?.title}</h1>
            {/* <p dangerouslySetInnerHTML={{ __html: data?.description }} /> */}
        </div>

    </>
}

export default YoutTube;