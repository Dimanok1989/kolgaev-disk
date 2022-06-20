import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import { axios } from "../../system";

const Download = props => {

    const { data, close } = props;

    React.useEffect(() => {

        axios.get(`disk/download/${data?.link}`)
            .then(({ data }) => {
                
                if (Boolean(data.url)) {
                    var tempLink = document.createElement('a');
                    tempLink.style.display = 'none';
                    tempLink.href = data.url;
                    tempLink.setAttribute('download', data.file.name);
                    // tempLink.setAttribute('target', '_blank');
                    document.body.appendChild(tempLink);
                    tempLink.click();

                    setTimeout(() => {
                        document.body.removeChild(tempLink);
                    }, 200);
                }
            })
            .catch(e => {

            })
            .then(() => {
                setTimeout(() => {
                    close();
                }, 300);
            });

    }, [data]);

    return <Dimmer active inverted><Loader /></Dimmer>;
}

export default Download;