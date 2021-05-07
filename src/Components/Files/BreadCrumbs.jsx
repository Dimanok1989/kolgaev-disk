import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setOpenFolder } from './../../store/files/actions';

import { Icon } from 'semantic-ui-react';

function BreadCrumbs(props) {

    const { breadCrumbs } = props;
    const crumbs = [];

    let last = null;
    let folders = null;

    let left = <div className="px-2">
        <h5 className="bread-name">Файлы</h5>
    </div>

    let right = null;

    if (breadCrumbs.length) {
        crumbs.push({
            id: null,
            name: "Файлы",
        });
    }

    let count = 1; // Счетчик крошек

    breadCrumbs.forEach(bread => {

        // Определение текущего каталога
        if (count === breadCrumbs.length) {
            last = <div className="px-2 mb-2">
                <h5 className="bread-name">{bread.name}</h5>
            </div>
        }
        else
            crumbs.push(bread);

        count++;

    });

    // Вывод крошек
    folders = crumbs.map(crumb => <button className="btn btn-link px-2 btn-bread" type="button" onClick={(e) => {
        props.setOpenFolder(crumb.id);
        props.history.push(`?folder=${crumb.id}`);
        e.currentTarget.blur();
    }} data-folder={crumb.id} key={crumb.id}>
        <span className="mr-2">{crumb.name}</span>
        <Icon name="angle right" />
    </button>);

    if (crumbs.length)
        left = <div>{folders}</div>;

    return <div className="px-2 mb-3" style={{ opacity: props.loading ? ".5" : "1" }}>
        <div className="d-flex justify-content-between align-items-center">
            {left}
            {right}
        </div>
        {last}
    </div>

}

const mapStateToProps = state => ({
    breadCrumbs: state.files.breadCrumbs,
});

const mapDispatchToProps = {
    setOpenFolder
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BreadCrumbs));