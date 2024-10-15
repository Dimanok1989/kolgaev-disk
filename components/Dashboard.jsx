import { useEffect } from "react";
import Echo from 'laravel-echo';
import Navbar from "@/components/Navbar";
import Header from "./Header/Header";

export const IO = require('socket.io-client');

const echoConnect = async () => {

    window.Echo = new Echo({
        broadcaster: 'socket.io',
        host: process.env.NEXT_PUBLIC_WS_PROTOCOL + "://" + process.env.NEXT_PUBLIC_WS_HOST,
        path: process.env.NEXT_PUBLIC_WS_PATH ? "/" + process.env.NEXT_PUBLIC_WS_PATH : "",
        auth: {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('kolgaev_api_token')
            }
        },
    });

}

const Dashboard = ({ children }) => {

    useEffect(() => {
        !window.Echo && echoConnect();
    }, []);

    return <div className={`flex items-stretch w-full min-h-screen`}>
        <div className="flex-grow">
            <Header />
            {/* <div className="bg-slate-900 min-w-[280px] w-[280px] fixed top-0 left-0 h-screen"><Navbar /></div> */}
            <div className="flex-grow">{children}</div>
        </div>
    </div>
}

export default Dashboard;
