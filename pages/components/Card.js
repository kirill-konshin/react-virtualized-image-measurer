import React, {Component} from "react";

const styles = {
    container: {
        border: '1px solid black',
        borderRadius: '5px',
        padding: '5px',
        background: '#f6f6f6'
    },
    image: {
        width: "100%",
        display: "block",
        visibility: "hidden"
    },
    media: {
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
    }
};

export default class Card extends Component {
    /**
     * It is important to ignore all other props except those that actually require redraw, size won't change after first
     * render so we pureposly don't look at it
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.title != nextProps.title || this.props.image != nextProps.image);
    }

    render() {
        const {image, title, size} = this.props;
        return (
            <div style={styles.container}>
                <h2>{title}</h2>
                <div style={{...styles.media, backgroundImage: `url(${image})`}}>
                    <img
                        src={image}
                        alt={title}
                        style={{
                            ...styles.image,
                            height: size ? size.height : "auto"
                        }}
                    />
                </div>
            </div>
        );
    }
}