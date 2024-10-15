import { Header } from "semantic-ui-react";
import Card from "../Views/Card";

const ScreenHeader = props => {

    const { title, subtitle } = props;

    return <Card
        content={<Header as="h1" content={title} subheader={subtitle} />}
    />
}

export default ScreenHeader;