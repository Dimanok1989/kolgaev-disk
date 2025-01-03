import { useRouter } from "next/router";
import { Icon } from "semantic-ui-react";
import { toTime } from "../Player/Video";
import { STATUS_DONE, STATUS_FAIL } from "@/pages/video";

const VideoCard = ({ data }) => {

    const router = useRouter();

    const push = () => {
        let url = `/video/${data.uuid}`;
        if (data.time) {
            url += `?t=${data.time}`;
        }
        router.push(url);
    }

    const percent = (data.time > 0 && data.duration > 0)
        ? Math.round((data.time * 100) / data.duration)
        : 0;

    const thumbnailUrl = data.thumbnail_url || data?.data?.thumbnail_url;

    return <div className="flex flex-col w-[256px]" title={data.title}>
        <div
            className={`bg-gray-300 rounded-xl hover:rounded cursor-pointer flex items-center justify-center relative overflow-hidden`}
            style={{
                backgroundImage: `url(${thumbnailUrl})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                width: 256,
                height: 144,
            }}
            onClick={push}
        >
            {(data.status === STATUS_FAIL && thumbnailUrl) && <div className="blur-sm absolute inset-0" style={{
                backgroundImage: `url(${thumbnailUrl})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}/>}

            {data.status === STATUS_DONE && false && <div
                className="bg-white px-5 py-2 rounded-xl opacity-60 cursor-pointer hover:opacity-100 shadow"
                onClick={push}
            >
                <Icon name="play" fitted size="big" color="red" />
            </div>}
            {(data.status !== STATUS_DONE && data.status !== STATUS_FAIL) && <div className="opacity-40 absolute z-30">
                <Icon name="clock" fitted size="big" />
            </div>}
            {data.status === STATUS_FAIL && <div className="absolute z-30">
                <Icon name="warning sign" fitted size="huge" color="red" />
            </div>}
            <div className="bg-black/20 w-full h-full hover:bg-black/0 z-20 hover:z-40"></div>
            <div className="bg-black/50 text-white absolute right-2 bottom-2 text-sm px-1 rounded">
                {toTime(data.duration)}
            </div>
            {(percent > 0) && <div className="absolute bottom-0 h-[5px] w-full z-30">
                <div
                    className={`h-full rounded-sm z-10`}
                    style={{
                        width: `${(percent < 10 ? 10 : percent)}%`,
                        background: data.viewed ? '#22c55e' : '#3b82f6'
                    }}
                />
            </div>}
        </div>
        <div className="truncate mt-2 cursor-pointer" onClick={push}>
            {data.title || <i className="opacity-50">Загрузка видео...</i>}
        </div>
    </div>
}

export default VideoCard;