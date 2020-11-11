import React from 'react';
import { withRouter } from "react-router";

import axios from './../../../Utils/axios';

import { Button } from 'react-bootstrap';
import FontAwesomeIcon from './../../../Utils/FontAwesomeIcon';

class CreateFolder extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: false,
        }

    }

    creature = false;

    /**
     * Метод создания нового каталога
     * 
     * @param {object} e event 
     */
    createFolder = e => {

        if (this.creature)
            return false;

        this.creature = true;
        this.setState({ loading: true });

        const query = new URLSearchParams(this.props.location.search);
        let folder = Number(query.get('folder')) || null;

        let formdata = new FormData();
        formdata.append('cd', folder);

        axios.post('disk/mkdir', formdata).then(({ data }) => {

            this.props.pushNewFolder(data.file);

        }).catch(error => {

            document.getElementById('add-new-folder').classList.add('text-danger');

        }).then(() => {

            this.creature = false;
            this.setState({ loading: false });

        });

    }

    render() {

        let disabled = this.props.disabled || this.state.loading;

        let icon = <FontAwesomeIcon icon={["fas", "folder-plus"]} title="Создать папку" />

        if (this.creature)
            icon = <FontAwesomeIcon icon={["fas", "spinner"]} className="fa-spin" />

        return (
            <Button variant="outline-secondary" disabled={disabled} onClick={this.createFolder} id="add-new-folder">
                {icon}
            </Button>
        )

    }

}

export default withRouter(CreateFolder);