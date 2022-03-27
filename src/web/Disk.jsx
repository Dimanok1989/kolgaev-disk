import { useEffect, useState } from "react";
import { Loader } from "semantic-ui-react";
import { BrowserRouter } from "react-router-dom";
import { axios } from "../system";
import { useActions } from "../hooks/useActions";
import Router from "./Router";
import { useSelector } from "react-redux";
import Header from "./Header";
import "./disk.css";

const Disk = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setIsLogin } = useActions();
    const store = useSelector(state => state.main);

    // console.log(store)

    useEffect(() => {

        axios.get('disk').then(({ data }) => {
            setIsLogin(true);
            setError(null);
        }).catch(e => {
            axios.setError(e, setError);
        }).then(() => {
            setLoading(false);
        });

    }, []);

    if (loading)
        return <Loader active />

    if (error) {
        return <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            color: "red",
        }}>
            <strong className="text-danger">{error}</strong>
        </div>
    }

    return <BrowserRouter>

        <div className="d-flex flex-column bg-light" id="content">

            <Header />

            <div className="flex-grow-1 position-relative d-flex">
                <Router />
            </div>
            
        </div>


    </BrowserRouter>

}

export default Disk;