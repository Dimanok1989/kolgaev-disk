import Image from "next/image";
import icons from "./Icons";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";

const File = props => {

    const { file } = props;
    const router = useRouter();
    const { folder } = useParams();

    const icon = file.is_image && file?.photos?.sm
        ? <img src={file.photos.sm} alt={file.name} />
        : <Image src={icons[file?.icon] ?? icons.file} alt={file.name} />;

    const name = (file.name.length > 15)
        ? file.name.slice(0, 15 - 3) + "..." + file.name.slice(-7)
        : file.name;

    const onClick = () => {
        if (file.is_dir) {
            router.push(`/${file.link}`);
        } else if (file.is_image && file?.photos?.sm) {
            router.push(`/${folder ? folder : ""}?photo=${file.link}`);
        }
    }

    return <div className="w-[100px] h-[140px] rounded hover:bg-gray-100 cursor-pointer px-2 py-1 flex flex-col gap-2" title={file.name} onClick={onClick}>
        <div className="grow flex justify-center items-center">{icon}</div>
        <div className="text-center break-all whitespace-pre-line text-sm h-[36px]">{name}</div>
    </div>
}

export default File;