import { APP_NAME } from "@/pages/_app";
import { STATUS_DONE, STATUS_FAIL } from "@/pages/video";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Icon } from "semantic-ui-react";
import { ProgressBar } from 'primereact/progressbar';
import { Skeleton } from 'primereact/skeleton';

const VideoProgress = (props) => {

    const { data, setData } = props;
    const [currentData, setCurrentData] = useState(data || {});
    const [process, setProcess] = useState(data?.process || []);
    const [number, setNumber] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    useEffect(() => {

        if (data && data?.status !== STATUS_DONE) {
            window.Echo && window.Echo.channel(`disk.video.${data.uuid}`)
                .listen('Tube\\DownloadProgressEvent', ({ data }) => {
                    console.log(data);
                    Boolean(data.process) && setProcess(data.process);
                    Boolean(data.thumbnail) && setThumbnail(data.thumbnail);
                    Boolean(data.fullData) && setCurrentData(p => ({ ...p, ...data.fullData }));
                    Boolean(data.fullData) && setData(data.fullData);
                    setNumber(data?.count || null);
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

            {(data.thumbnail_url || data?.data?.thumbnail_url || thumbnail?.lg) && <div className="absolute inset-0 w-full h-full blur-lg">
                <img src={data.thumbnail_url || data?.data?.thumbnail_url || thumbnail?.lg} className="w-full h-full" />
                <div className="absolute inset-0 w-full h-full bg-black/70" />
            </div>}

            <div className="absolute top-10 left-10 right-10">

                <div className="mb-3 flex items-center gap-2 text-white">
                    <span><Icon name="clock" fitted /></span>
                    <strong>Подготовка видео...</strong>
                </div>

                <div className="flex flex-col gap-2 max-w-xl">

                    {process.length === 0 && <>
                        <Skeleton width="10rem" className="bg-gray-800 mb-2" />
                        <Skeleton width="9rem" className="bg-gray-800 mb-2" />
                        <Skeleton width="10rem" className="bg-gray-800 mb-2" />
                    </>}

                    {process.map(item => <div key={item.video} className="relative flex items-center gap-3 h-[22px]">

                        <div className={`${item.active ? 'text-white' : ''}`}>
                            Загрузка <code>{item.format}</code>
                        </div>

                        {Boolean(item.completed) && !Boolean(item.error) && <div className="relative flex items-center justify-center">
                            <span><Icon name="check circle" fitted color="green" /></span>
                        </div>}

                        {Boolean(item.error) && <div className="relative flex items-center justify-center">
                            <span title={item.error}><Icon name="remove circle" fitted color="red" /></span>
                        </div>}

                        {item.active && !Boolean(item.percent) && !Boolean(item.completed) && <div className="!w-full !max-w-[100px] !mb-0">
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

                        {item.percent && !Boolean(item.completed) && <div className="relative !w-full !max-w-[100px] !mb-0">
                            {number !== 2 && <ProgressBar
                                mode={item.percent >= 100 ? "indeterminate" : "determinate"}
                                value={number !== 2 ? (item.percent || 0) : 0}
                                showValue={false}
                                className="w-full"
                                color="#2ecc40"
                                style={{
                                    height: '6px',
                                    background: "rgba(255,255,255,.08)"
                                }}
                            />}
                            {number === 2 && <ProgressBar
                                mode={item.percent >= 100 ? "indeterminate" : "determinate"}
                                value={number === 2 ? (item.percent || 0) : 0}
                                showValue={false}
                                className="w-full"
                                color="#216bba"
                                style={{
                                    height: '6px',
                                    background: "#2ecc40"
                                }}
                            />}
                        </div>}

                        <div className="flex-grow flex items-center justify-start gap-3">
                            {item.active && item.percent > 0 && !Boolean(item.completed) &&
                                <code>{item.percent}%</code>
                            }
                            {item.active && item.percent < 100 && Boolean(item.speed) && !Boolean(item.completed) &&
                                <code>{item.speed}</code>
                            }
                        </div>

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