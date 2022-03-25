import { Route, Switch } from "react-router-dom";
import Files from "./Files";

const Router = () => {

    return <Switch>
        <Route path="/" component={Files} />
        <Route path="*" component={null} />
    </Switch>
}

export default Router;