import React from 'react';
import Spinner from 'react-bootstrap/Spinner'

class LoadingModal extends React.Component {

    // constructor(props) {
    //     super(props);
    // }

    render() {

        if (!this.props.loading)
            return null;

        return (
            <div className="d-flex justify-content-center align-items-center loading-app loading-modal position-absolute">
                <Spinner
                    animation="grow"
                    variant="dark"
                    size="sm"
                />
            </div>
        )

    }

}

export default LoadingModal;
