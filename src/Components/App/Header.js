import React from 'react';
import { Link } from 'react-router-dom';

import Icon from './../../Utils/FontAwesomeIcon'

class Header extends React.Component {

    showMenu = el => {

        let open = el.currentTarget.dataset.open;

        if (open === "0")
            this.openMenu();
        else
            this.closeMenu();

    }

    openMenu = () => {
        
        document.getElementById('menu-open-btn').dataset.open = "1";
        document.getElementById('userlist-menu').style.left = "0";

        setTimeout(() => document.querySelector('body').addEventListener('click', this.closeMenu), 300);
        

    }

    closeMenu = () => {

        document.getElementById('menu-open-btn').dataset.open = "0";
        document.getElementById('userlist-menu').style.left = "-900px";

        document.querySelector('body').removeEventListener('click', this.closeMenu);

    }

    render() {

        if (!this.props.isLogin)
            return null;

        return (
            <div className="bg-dark text-light p-3">

                <div className="header-menu mx-auto d-flex justify-content-between align-items-center">

                    <div className="d-flex align-items-center">

                        <Icon icon={['fas', 'bars']} className="menu-open mr-3 fa-lg" onClick={this.showMenu} data-open="0" id="menu-open-btn" />

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
