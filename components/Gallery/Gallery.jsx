import { useApp } from "@/hooks/useApp";
import useAxios from "@/hooks/useAxios";
import { getError } from "@/hooks/useFetch";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Toast } from 'primereact/toast';
import { Galleria } from 'primereact/galleria';
import { useRouter } from "next/router";

const FolderGallery = () => {

    const { folder } = useParams();
    const {
        galleria,
        galleryImages,
        setGalleryImages,
        galleryActiveIndex,
        setGalleryActiveIndex
    } = useApp();
    const { axios } = useAxios();
    const toast = useRef(null);
    const [images, setImages] = useState(null);
    const router = useRouter();

    useEffect(() => {

        if (galleryImages[folder || 0]) {
            setImages(galleryImages[folder || 0]);
            return;
        }

        axios.get(`disk/gallery`, { params: folder ? { folder } : {} })
            .then(({ data }) => {
                setGalleryImages(folder || 0, data);
                setImages(data);
            })
            .catch(e => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Ошибка галереи',
                    detail: getError(e),
                    life: 10000
                });
            });

    }, [folder]);

    // console.log(photo);

    const itemTemplate = (item) => {
        return <img src={item.xl} alt={item.alt} style={{ width: '100%', display: 'block' }} />;
    }

    const thumbnailTemplate = (item) => {
        return <img src={item.sm} alt={item.alt} style={{ display: 'block' }} />;
    }

    return <div>
        <Toast ref={toast} />
        <Galleria
            ref={galleria}
            value={images}
            numVisible={7}
            style={{ maxWidth: '95%' }}
            activeIndex={galleryActiveIndex}
            onItemChange={(e) => setGalleryActiveIndex(e.index)}
            circular
            fullScreen
            showItemNavigators
            showThumbnails={false}
            item={itemTemplate}
            thumbnail={thumbnailTemplate}
            onHide={() => router.replace(`/${folder ? folder : ""}`, null, { scroll: false })}
        />
    </div>
}

export default FolderGallery;