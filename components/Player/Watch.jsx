import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Modal } from "semantic-ui-react";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import useAxios from "@/hooks/useAxios";
import Video from "./Video";
import { useParams } from "next/navigation";
import { useApp } from "@/hooks/useApp";
import { useResize } from "@/hooks/useResize";
import { getError } from "@/hooks/useFetch";

const Watch = () => {

    const router = useRouter();
    const { folder } = useParams();
    const watch = router?.query?.watch;
    const { watchImages } = useApp();

    const { axios } = useAxios();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [error, setError] = useState(null);

    const preview = useRef();
    const windowWidth = useResize();
    const [height, setHeight] = useState(300);

    useEffect(() => {
        if (preview.current?.offsetWidth) {
            setHeight(preview.current.offsetWidth * (9 / 16));
        }
    }, [windowWidth]);

    useEffect(() => {

        setLoading(true);

        if (!watch) {
            setData({});
            setError(null);
            document.getElementsByTagName("body")[0].style.overflow = 'auto';
            return;
        }

        if (preview.current?.offsetWidth) {
            setHeight(preview.current.offsetWidth * (9 / 16));
        }

        axios.get(`disk/video/${watch}`)
            .then(({ data }) => {
                setData(data);
                setError(null);
            })
            .catch(e => {
                setError(getError(e));
            })
            .then(() => {
                setLoading(false);
            });

        document.getElementsByTagName("body")[0].style.overflow = 'hidden';

    }, [watch]);

    if (!Boolean(watch)) {
        return;
    }

    return <div className="fixed flex-col inset-0 z-50 bg-black/90 flex justify-center items-center px-0 sm:px-5">

        <div
            className="w-[56px] h-[56px] flex justify-center items-center absolute top-0 right-0 hover:opacity-100 opacity-60 cursor-pointer text-white z-10"
            onClick={() => router.replace(`/${folder ? folder : ""}`, null, { scroll: false })}
        >
            <i className="pi pi-times" style={{ fontSize: '2rem' }} />
        </div>

        <div className="w-full max-w-screen-xl">

            {!Boolean(data?.url) && <div className="bg-black/70 w-full rounded-xl flex items-center justify-center" ref={preview} style={{ height }}>
                {watchImages[watch] && <img src={watchImages[watch]} className="rounded-xl blur max-h-full" />}
                {loading && <ProgressSpinner className="z-10 absolute" />}
                {error && <Message severity="error" text={error} className="absolute" />}
            </div>}
            
            {data?.url && <Video
                videoUrl={data.url}
                videoType={data.mime_type}
                length={data.duration}
                title={data.name}
                files={[data.file]}
            />}

            <div className="mt-3 px-3 sm:px-0">
                <h3 className="text-white">{data.name}</h3>
            </div>
        </div>

    </div>
}

export default Watch;