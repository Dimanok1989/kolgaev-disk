import StartView from "@/components/Tube/StartView";
import VideoCard from "@/components/Tube/VideoCard";
import useFetch from "@/hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Loader } from "semantic-ui-react";
import { Messages } from 'primereact/messages';
import { APP_NAME } from "../_app";
import Head from "next/head";

export const STATUS_DONE = 7;
export const STATUS_FAIL = 8;

const Tube = () => {

    const { isLoading, isError, error, getJson } = useFetch();
    const [videos, setVideos] = useState([]);
    const [meta, setMeta] = useState({});
    const [currentPage, setCurrentPage] = useState(meta?.current_page || 1);
    const msgs = useRef();

    const { ref, inView } = useInView({
        threshold: 0.3,
    });

    const fetchVideos = async (params) => {
        await getJson('disk/video', params, response => {
            setVideos(p => [...p, ...response.data]);
            setMeta(response.meta);
            setCurrentPage((response?.meta?.current_page || 0) + 1);
        }, e => {

        });
    }

    // useEffect(() => {

    //     window.Echo && window.Echo.channel(`disk.videos`)
    //         .listen('Tube\\DownloadProgressEvent', ({ data }) => {
    //             console.log(data);
    //         });

    //     return () => {
    //         window.Echo && window.Echo.leaveChannel(`disk.videos`);
    //     }

    // }, []);

    useEffect(() => {
        (error && msgs.current) && msgs.current.show([{
            sticky: true,
            severity: 'error',
            detail: error,
            closable: false
        }]);
    }, [error]);

    useEffect(() => {
        if (meta?.current_page && meta?.current_page >= meta?.last_page) {
            return;
        }
        (currentPage <= 1) && setVideos([]);
        (inView && !isLoading) && fetchVideos({ page: currentPage });
    }, [currentPage, inView]);

    return <>

        <Head>
            <title>Видео | {APP_NAME}</title>
        </Head>

        <div className="max-w-screen-xl mx-auto">

            <div className="mt-12">
                <StartView />
            </div>

            {isError && <div className="flex justify-center mt-10">
                <Messages ref={msgs} className="w-full max-w-screen-md" />
            </div>}

            <div className={`p-5 flex flex-wrap items justify-center gap-4`}>
                {videos.map((a, k) => <VideoCard key={k} data={a} />)}
                <div className="w-[256px]"></div>
                <div className="w-[256px]"></div>
                <div className="w-[256px]"></div>
                <div className="w-[256px]"></div>
                <div className="w-[256px]"></div>
            </div>
            <div className="w-full h-[32px] relative mb-3">
                {isLoading && <div className="text-center absolute left-0 right-0 top-0 bottom-0">
                    <Loader active inline />
                </div>}
            </div>
            <div ref={ref} className="h-1" />
        </div>

    </>
}

export default Tube;