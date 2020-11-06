import React from 'react';

class Header extends React.Component {

    render() {

        if (!this.props.isLogin)
            return null;

        return (
            <div className="bg-dark text-light p-3">
                <div className="header-menu mx-auto d-flex justify-content-between align-items-center">
                    <div className="d-flex">
                        <div className="font-weight-bold">Kolgaev.ru</div>
                        <div className="ml-2">Диск</div>
                    </div>
                </div>
            </div>
        )

    }

}

export default Header;
