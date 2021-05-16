import React from 'react';

import UsersList from './Users/UsersList'

function MainMenu() {

    React.useEffect(() => {

        const block = document.getElementById('main-menu');
        block.style.top = `${block.getBoundingClientRect().top}px`;

    }, []);

    return <div className="main-menu" id="main-menu">
        <UsersList />
    </div>

}

export default MainMenu;