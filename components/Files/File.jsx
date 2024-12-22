import Image from "next/image";
import icons from "./Icons";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import useAxios from "@/hooks/useAxios";
import { getError } from "@/hooks/useFetch";
import { Image as Photo } from 'primereact/image';
import { Icon } from "semantic-ui-react";
import { useApp } from "@/hooks/useApp";

const File = props => {

    const { file, onContextMenu, isActive } = props;
    const router = useRouter();
    const { folder } = useParams();
    const { axios } = useAxios();
    const { galleria, galleryImages, setGalleryActiveIndex, setWatchImages } = useApp();

    let icon = <Image
        src={icons[file?.icon] || icons.file}
        alt={file.name}
    />

    if (file.is_image && file?.photos?.sm) {
        // icon = <Photo
        //     src={file.photos.sm}
        //     zoomSrc={file.photos.xl}
        //     alt={file.name}
        //     preview
        //     className="!text-white"
        //     imageClassName="!max-h-[90px]"
        //     indicatorIcon={<i className="pi pi-search" />}
        //     onHide={() => router.push(`/${folder ? folder : ""}`)}
        // />
        icon = <Photo
            src={file.photos.sm}
            alt={file.name}
            imageClassName="!max-h-[90px]"
        />
    } else if (file.is_video && file?.photos?.sm) {
        icon = <div className="flex relative items-center justify-center">
            <Photo
                src={file.photos.sm}
                alt={file.name}
                imageClassName="!max-h-[90px]"
            />
            <span className="absolute">
                <Icon
                    name="play"
                    fitted
                    link
                    size="large"
                    className="!text-white"
                />
            </span>
        </div>
    }

    const name = (file.name.length > 15)
        ? file.name.slice(0, 15 - 3) + "..." + file.name.slice(-7)
        : file.name;

    const onClick = () => {
        if (file.is_dir) {
            router.push(`/${file.link}`);
        } else if (file.is_image && file?.photos?.sm) {
            router.replace(`/${folder ? folder : ""}?photo=${file.link}`, null, { scroll: false });
            let index = (galleryImages[folder || 0] || []).map(f => f.link).indexOf(file.link);
            setGalleryActiveIndex(index >= 0 ? index : 0);
            galleria.current.show();
        } else if (file.is_video) {
            setWatchImages(file.link, file?.photos?.xl);
            router.replace(`/${folder ? folder : ""}?watch=${file.link}`, null, { scroll: false });
        }
    }

    return <>
        <div
            className={`w-[100px] h-[140px] rounded hover:bg-gray-100 ${isActive ? `bg-gray-100` : ``} cursor-pointer px-2 py-1 flex flex-col gap-2`}
            title={file.name}
            onClick={onClick}
            onContextMenu={e => onContextMenu(e, file)}
        >
            <div className="grow flex justify-center items-center max-h-[90px]">{icon}</div>
            <div className="text-center break-all whitespace-pre-line text-sm h-[36px]">{name}</div>
        </div>
    </>
}

export default File;