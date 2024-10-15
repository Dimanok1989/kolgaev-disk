import { useApp } from '@/hooks/useApp';
import Dashboard from '../components/Dashboard';
import Login from '@/pages/user/login';

const Layout = (props) => {

    const { children } = props;
    const { error } = useApp();

    return Boolean(error)
        ? (error?.status === 401
            ? <Login />
            : <div className="flex items-center justify-center w-full px-4 py-10">
                <h1 className="text-red-600">{typeof error.message == "string" ? error.message : "Failed to load"}</h1>
            </div>
        )
        : <Dashboard>{children}</Dashboard>
}

export default Layout;