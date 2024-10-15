import { useRouter } from "next/router";
import { Icon } from "semantic-ui-react";
import { toTime } from "../Player/Video";
import { STATUS_DONE } from "@/pages/video";

const VideoCard = ({ data }) => {

    const router = useRouter();

    const push = () => {
        let url = `/video/${data.uuid}`;
        if (data.time) {
            url += `?t=${data.time}`;
        }
        router.push(url);
    }

    const percent = (data.time > 0 && data.length > 0)
        ? Math.round((data.time * 100) / data.length)
        : 0;

    return <div className="flex flex-col w-[256px]" title={data.title}>
        <div
            className="bg-gray-500/50 rounded-xl hover:rounded cursor-pointer flex items-center justify-center relative overflow-hidden"
            style={{
                backgroundImage: `url(${data.thumbnail_url})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                width: 256,
                height: 144,
            }}
            onClick={push}
        >
            {data.status === STATUS_DONE && false && <div
                className="bg-white px-5 py-2 rounded-xl opacity-60 cursor-pointer hover:opacity-100 shadow"
                onClick={push}
            >
                <Icon name="play" fitted size="big" color="red" />
            </div>}
            {data.status !== STATUS_DONE && <div className="opacity-40 absolute">
                <Icon name="clock" fitted size="big" />
            </div>}
            <div className="bg-black/50 w-full h-full hover:bg-black/0 hover:z-20"></div>
            <div className="bg-black/50 text-white absolute right-2 bottom-2 text-sm px-1 rounded">
                {toTime(data.length)}
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
            {data.title}
        </div>
    </div>
}

export default VideoCard;