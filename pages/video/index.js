import StartView from "@/components/Tube/StartView";
import VideoCard from "@/components/Tube/VideoCard";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Loader, Message } from "semantic-ui-react";

export const STATUS_DONE = 5;

const Tube = () => {

    const { isLoading, isError, error, getJson } = useFetch();
    const [videos, setVideos] = useState([]);
    const [meta, setMeta] = useState({});
    const [currentPage, setCurrentPage] = useState(meta?.current_page || 1);

    const { ref, inView } = useInView({
        threshold: 0.3,
    });

    const fetchVideos = async (params) => {
        await getJson('disk/video', params, response => {
            setVideos(p => [...p, ...response.data]);
            setMeta(response.meta);
            setCurrentPage((response?.meta?.current_page || 0) + 1);
        });
    }

    useEffect(() => {
        if (meta?.current_page && meta?.current_page >= meta?.last_page) {
            return;
        }
        (currentPage <= 1) && setVideos([]);
        (inView && !isLoading) && fetchVideos({ page: currentPage });
    }, [currentPage, inView]);

    return <div className="max-w-screen-xl mx-auto">
        {isError && <div className="flex justify-center">
            <Message color="red" content={error} />
        </div>}
        {!isError && <StartView />}
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
}

export default Tube;