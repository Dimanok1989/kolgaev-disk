import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {

    render() {

        if (!this.props.isLogin)
            return null;

        return (
            <div className="bg-dark text-light p-3">
                <div className="header-menu mx-auto d-flex justify-content-between align-items-center">
                    <div className="d-flex">
                        <Link className="header-link" to="/">
                            <span className="font-weight-bold">Kolgaev.ru</span>
                            <span className="ml-2">Диск</span>
                        </Link>
                    </div>
                </div>
            </div>
        )

    }

}

export default Header;
