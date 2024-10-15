import { APP_NAME } from "@/pages/_app";
import { STATUS_DONE } from "@/pages/video";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Icon, Loader, Progress } from "semantic-ui-react";

const VideoProgress = (props) => {

    const { data, setData } = props;
    const [currentData, setCurrentData] = useState(data || {});
    const [process, setProcess] = useState(data?.download_process || []);

    useEffect(() => {

        if (data && data?.status !== STATUS_DONE) {
            window.Echo && window.Echo.channel(`disk.video.${data.uuid}`)
                .listen('Tube\\DownloadProgressEvent', ({ data }) => {
                    console.log(data);
                    setProcess(data.steps || process);
                    setCurrentData(data.processData);
                    if (data.fullData) {
                        setData(data.fullData);
                    }
                });
        }

        return () => {
            (data && window.Echo) && window.Echo.leaveChannel(`disk.video.${data.uuid}`);
        }
    }, [data]);

    return <>

        <Head>
            <title>{currentData.title} | {APP_NAME}</title>
        </Head>

        <div className={`relative bg-black/90 rounded-lg overflow-hidden w-full pt-[56.25%] text-white/50`}>
            <div className="absolute top-10 left-10">
                <h2 className="text-white/80"><Icon name="clock" /> Видео ещё не готово :-(</h2>
                <div className="flex flex-col gap-4">
                    {process.map(item => <div key={item.step} className="relative flex items-center gap-3 !h-[20px]">
                        <code className={`${item.active ? 'text-white' : ''}`}>{item.name}</code>
                        {Boolean(item.completed) && <span className="relative flex items-center justify-center">
                            <span><Icon name="check circle" fitted color="green" /></span>
                        </span>}
                        {item.percent && <Progress
                            inverted
                            active
                            percent={item.percent || 0}
                            size='tiny'
                            className="!absolute top-full !w-full !max-w-[300px]"
                        />}
                    </div>)}
                </div>
            </div>
        </div>

        {!data?.title && currentData.title && <h1>{currentData.title}</h1>}

    </>
}

export default VideoProgress;