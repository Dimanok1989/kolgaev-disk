import { Loader, Message, MessageHeader } from "semantic-ui-react";
import Card from "../Views/Card";
import ScreenHeader from "./ScreenHeader";

const Screen = props => {

    const { title, notWithCard, error, compact } = props;
    const loading = Boolean(props.loading);
    const isError = Boolean(error);

    const componentProps = { notWithCard };
    const content = props.content ?? props.children;

    return <div className={`px-10 py-8 ${compact ? 'max-w-[1124px] mx-auto' : ''}`}>
        {title && <ScreenHeader {...props} />}
        {isError && <Message negative className="!rounded-lg">
            <MessageHeader>Ошибка данных</MessageHeader>
            <p>{error}</p>
        </Message>}
        {loading && <Component {...componentProps}>
            <div className="py-14">
                <Loader active />
            </div>
        </Component>}
        {!loading && !isError && content && <Component {...componentProps}>{content}</Component>}
    </div>
}

const Component = (props) => {

    const { children, notWithCard } = props;

    return notWithCard
        ? <div className="relative">{children}</div>
        : <Card {...props}>{children}</Card>
}

export default Screen;