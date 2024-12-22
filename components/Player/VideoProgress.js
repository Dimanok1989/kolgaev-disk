import { APP_NAME } from "@/pages/_app";
import { STATUS_DONE } from "@/pages/video";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Icon, Progress } from "semantic-ui-react";
import { ProgressBar } from 'primereact/progressbar';

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
            <title>{currentData.title || "Подготовка видео..."} | {APP_NAME}</title>
        </Head>

        <div className={`relative overflow-hidden w-full pt-[56.25%] text-white/50`}>

            <div className="absolute top-10 left-10 right-10">

                <div className="mb-3 flex items-center gap-2 text-white">
                    <span><Icon name="clock" fitted /></span>
                    <strong>Видео ещё не готово :-(</strong>
                </div>

                <div className="flex flex-col gap-2 max-w-xl">

                    {process.map(item => <div key={item.step} className="relative flex items-center gap-3">

                        <div>
                            <code className={`${item.active ? 'text-white' : ''}`}>{item.name}</code>
                        </div>

                        {Boolean(item.completed) && <div className="relative flex items-center justify-center">
                            <span><Icon name="check circle" fitted color="green" /></span>
                        </div>}

                        <div class="flex-grow"></div>

                        {item.active && !Boolean(item.percent) && <div className="!w-full !max-w-[100px] !mb-0">
                            <ProgressBar
                                mode="indeterminate"
                                className="w-full"
                                color="#888"
                                style={{
                                    height: '6px',
                                    background: "rgba(255,255,255,.08)"
                                }}
                            />
                        </div>}

                        {item.percent && <Progress
                            inverted
                            active
                            percent={item.percent || 0}
                            size='tiny'
                            className="!w-full !max-w-[100px] !mb-0"
                        />}
                    </div>)}
                </div>
            </div>

        </div>

        {!data?.title && currentData.title && <div className="mt-4 px-2 sm:px-0 max-w-screen-xl mx-auto">
            <h1>{currentData.title}</h1>
        </div>}

    </>
}

export default VideoProgress;