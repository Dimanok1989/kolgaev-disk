import { Image } from "semantic-ui-react";
import icons from "../../Icons";

export const useFileIcon = (row) => {

    let icon = null,
        type = null;

    if (row?.thumb_litle_url) {

        type = row.is_video ? "video" : null;

        icon = <Image
            src={row.thumb_litle_url}
            style={{
                maxWidth: 74,
                maxHeight: 74
            }}
            rounded
        />
    } else {
        icon = <Image src={icons[row?.icon] || icons?.file} />
    }

    return {
        icon,
        type,
    }

}

export default useFileIcon;