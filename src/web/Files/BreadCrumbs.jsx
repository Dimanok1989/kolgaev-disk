import React from "react";
import { withRouter } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";

const BreadCrumbs = props => {

    const data = (props.data || []);
    const length = (data.length - 1);
    const urls = [];

    const sections = data.map((row, i) => {

        urls.push(row.link);

        const section = {
            key: i,
            content: row.name,
            url: urls.join('/'),
        }

        if (i !== length) {
            section.link = true;
            section.onClick = (e, { url }) => props.history.push(`/${url}`);
        } else {
            section.active = true;
        }

        return section;
    });

    return <Breadcrumb
        icon="right angle"
        sections={[{
            key: "main",
            content: "Файлы",
            onClick: data.length === 0 ? null : () => props.history.push(`/`),
            active: data.length === 0,
        }, ...sections]}
        className="mt-4"
        size="large"
    />
}

export default withRouter(BreadCrumbs);