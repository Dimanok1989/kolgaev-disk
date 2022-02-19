import { Route, Switch } from "react-router-dom";

const Router = () => {

    return <Switch>
        <Route path="*" component={null} />
    </Switch>
}

export default Router;