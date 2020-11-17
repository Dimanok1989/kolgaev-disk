import React from 'react';

import axios from './../../../Utils/axios';
import echoerror from './../../../Utils/echoerror';

import { Spinner } from 'react-bootstrap';
import Icon from './../../../Utils/FontAwesomeIcon';

class ShowImage extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            id: null,
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

        // if (this.props.id !== null) {

        //     this.showImage(this.props.id);

        // }

    }

    componentDidUpdate = prevProps => {

        if (prevProps.id !== this.props.id && this.props.id !== null) {

            this.showImage(this.props.id);

        }

    }

    showImage = id => {

        let formdata = new FormData();
        formdata.append('id', id);

        this.setState({
            id: this.props.id,
            show: true,
            loading: true,
            image: null,
            name: null,
            error: null,
        });

        axios.post('disk/showImage', formdata).then(({ data }) => {

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
        this.props.changeImage("next", this.state.id);
    }

    backImage = () => {
        this.props.changeImage("back", this.state.id);
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

export default ShowImage;