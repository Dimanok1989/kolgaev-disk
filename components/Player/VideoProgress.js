import { APP_NAME } from "@/pages/_app";
import { STATUS_DONE, STATUS_FAIL } from "@/pages/video";
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
                    setCurrentData(data.processData || data.fullData || {});
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
            <title>{currentData?.title || "Подготовка видео..."} | {APP_NAME}</title>
        </Head>

        <div className={`relative overflow-hidden w-full pt-[56.25%] text-white/50`}>

            {(data.thumbnail_url || data?.data?.thumbnail_url) && <div className="absolute inset-0 w-full h-full blur-lg">
                <img src={data.thumbnail_url || data?.data?.thumbnail_url} className="w-full h-full" />
                <div className="absolute inset-0 w-full h-full bg-black/70" />
            </div>}

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

                        {Boolean(item.completed) && data.status !== STATUS_FAIL && <div className="relative flex items-center justify-center">
                            <span><Icon name="check circle" fitted color="green" /></span>
                        </div>}

                        {(
                            (item.active && data.status === STATUS_FAIL)
                            || (item.step === "video" && data.download_process_error?.errorCode === 1)
                            || (item.step === "audio" && data.download_process_error?.errorCode === 2)
                            || (item.step === "video" && data.download_process_error?.errorCode === 3)
                        ) && <div className="relative flex items-center justify-center">
                                <span><Icon name="remove circle" fitted color="red" /></span>
                            </div>
                        }

                        <div className="flex-grow"></div>

                        {item.active && !Boolean(item.percent) && data.status !== STATUS_FAIL && <div className="!w-full !max-w-[100px] !mb-0">
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

                    {data.download_process_error?.error && <div className="flex mt-2">
                        <div className="text-red-500">
                            {Boolean(data.download_process_error?.errorCode) && <strong className="pe-3">ERR:{data.download_process_error?.errorCode}</strong>}
                            {data.download_process_error?.error}
                        </div>
                        <div className="flex-grow" />
                    </div>}
                </div>
            </div>

        </div>

        {!data?.title && currentData.title && <div className="mt-4 px-2 sm:px-0 max-w-screen-xl mx-auto">
            <h1 className="text-[18px]">{currentData.title}</h1>
        </div>}

    </>
}

export default VideoProgress;