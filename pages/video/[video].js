import Video from "@/components/Player/Video";
import useFetch from "@/hooks/useFetch";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { STATUS_DONE } from ".";
import VideoProgress from "@/components/Player/VideoProgress";
import Head from "next/head";
import { APP_NAME } from "../_app";

const YoutTube = () => {

    const { video } = useParams();
    const { getJson } = useFetch();
    const [data, setData] = useState(null);

    useEffect(() => {
        if (video) {
            getJson(`disk/video/get/${video}`, null, response => {
                setData(response);
            });
        }
    }, [video]);

    return <div className="w-full max-w-screen-xl h-[56.25%] mx-auto">

        <Head>
            <title>{data?.title} | {APP_NAME}</title>
        </Head>

        {(data && data?.status === STATUS_DONE) && <Video
            id={data.uuid}
            videoUrl={data.video_url}
            videoType={data.video_mime_type}
            length={data.length}
            title={data.title}
        />}

        {(data && data?.status !== STATUS_DONE) && <VideoProgress
            data={data}
            setData={setData}
        />}

        <div className="mt-4">
            <h1 className="text-[20px]">{data?.title}</h1>
            {/* <p dangerouslySetInnerHTML={{ __html: data?.description }} /> */}
        </div>

    </div>
}

export default YoutTube;