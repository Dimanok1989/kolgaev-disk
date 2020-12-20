import React from 'react';
import { withRouter } from "react-router";

import axios from './../../../Utils/axios';
import echoerror from './../../../Utils/echoerror';

import { Spinner } from 'react-bootstrap';
import Icon from './../../../Utils/FontAwesomeIcon';

class ShowImage extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            id: null,
            folder: null,
            show: false,
            loading: true,
            image: null,
            name: null,
            error: null,
            next: null,
            back: null,
        }

    }

    componentDidMount = () => {

        // Преобрвазоание поикового запроса из ссылки в объект
        const query = new URLSearchParams(this.props.location.search);

        // Установка выбранного пользователя
        this.setState({
            folder: Number(query.get('folder')) || null
        });

        // if (this.props.id !== null) {

        //     this.showImage(this.props.id);

        // }

    }

    componentDidUpdate = props => {

        if (props.id !== this.props.id && this.props.id !== null) {

            this.showImage(this.props.id);

        }

    }

    showImage = (id, step = null) => {

        this.setState({
            show: true,
            loading: true,
            image: null,
            name: null,
            error: null,
        });

        axios.post('disk/showImage', {
            id,
            step,
            folder: this.state.folder
        }).then(({ data }) => {

            this.setState({ id: data.id });

            let img = new Image();
            img.src = data.link;

            img.onload = () => {
                this.setState({
                    image: data.link,
                    name: data.name
                });
            }

        }).catch(error => {

            this.setState({ error: echoerror(error) });

        }).then(() => {

            this.setState({ loading: false });

        });

    }

    nextImage = () => {
        this.changeImage("next", this.state.id);
        // this.props.changeImage("next", this.state.id);
    }

    backImage = () => {
        this.changeImage("back", this.state.id);
        // this.props.changeImage("back", this.state.id);
    }

    changeImage = (step = "next", id = null) => {

        this.showImage(id, step);
        // console.log(step, id);

    }

    closeShowImage = () => {

        this.setState({ show: false });

        this.props.closeShowImage();

    }

    render() {

        if (!this.state.show)
            return null;

        let image = this.state.loading ? <Spinner variant="light" animation="border" /> : <img src={this.state.image} alt={this.state.name} />

        if (this.state.error)
            image = <div className="text-danger"><strong>Ошибка</strong> {this.state.error}</div>

        return (
            <div className="lite-box loading-app d-flex align-items-center justify-content-center">

                {image}

                <div className="d-flex justify-content-center align-items-center hover cursor-pointer lite-box-close" onClick={this.closeShowImage}>
                    <Icon icon={['fas', 'times']} className="text-light" />
                </div>

                <div className="d-flex justify-content-start align-items-center hover lite-box-back cursor-pointer" onClick={this.backImage}>
                    <Icon icon={['fas', 'chevron-left']} className="text-light" />
                </div>

                <div className="d-flex justify-content-end align-items-center hover lite-box-next cursor-pointer" onClick={this.nextImage}>
                    <Icon icon={['fas', 'chevron-right']} className="text-light" />
                </div>

            </div>
        )

    }

}

export default withRouter(ShowImage);