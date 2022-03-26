import { Route, Switch } from "react-router-dom";
import Desktop from "./Files/Desktop";

const Router = () => {

    return <Switch>
        <Route path="/" component={Desktop} />
        <Route path="*" component={null} />
    </Switch>
}

export default Router;