import React from 'react';
import Lightbox from 'react-image-lightbox';

export default class ImgLightbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: this.props.images,
            index: this.props.index || 0,
            show: this.props.show
        };
    }

    render() {

        let {images, index, show} = {...this.state};

        return <div>{show && <Lightbox
            mainSrc={images[index]}
            nextSrc={images[(index + 1) % images.length]}
            prevSrc={images[(index + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({show: false})}
            onMovePrevRequest={() =>
                this.setState({
                    index: (index + images.length - 1) % images.length,
                })
            }
            onMoveNextRequest={() =>
                this.setState({
                    index: (index + 1) % images.length,
                })
            }/>}</div>
    }
}
