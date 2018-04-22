import React, {PureComponent} from "react";
import PropTypes from "prop-types";

const styles = {
    position: "absolute",
    bottom: "0",
    right: "0",
    width: "1px",
    height: "1px",
    overflow: "hidden",
    opacity: 0
};

export default class ImageMeasurer extends PureComponent {

    static displayName = "ImageMeasurer";

    static propTypes = {
        onError: PropTypes.func,
        timeout: PropTypes.number,
        image: PropTypes.func.isRequired,
        children: PropTypes.func.isRequired,
        defaultWidth: PropTypes.number.isRequired,
        defaultHeight: PropTypes.number.isRequired
    };

    static defaultProps = {
        timeout: 5000
    };

    makeItemsWithSizes = (items, sizes) => items.reduce((res, item) => {

        if (res.stop) return res;

        const src = this.props.image(item);
        const size = sizes[src];

        // this will stop execution for first non-loaded image
        if (src && !size) {
            return {...res, stop: true};
        }

        res.itemsWithSizes.push({
            item,
            size
        });

        return res;

    }, {itemsWithSizes: [], stop: false}).itemsWithSizes;

    timeouts = {};

    state = {
        sizes: {},
        itemsWithSizes: this.makeItemsWithSizes(this.props.items, {})
    };

    onLoad = (src, ref) => {

        this.clearTimeout(src);

        if (this.state.sizes[src]) return;

        const size = {
            width: ref.offsetWidth,
            height: ref.offsetHeight
        };

        const sizes = {
            ...this.state.sizes,
            [src]: size
        };

        const itemsWithSizes = this.makeItemsWithSizes(this.props.items, sizes);

        this.setState({
            sizes,
            itemsWithSizes
        });

    };

    onLoadError = (src, error) => {
        this.props.onError(error);
        this.onLoad(src, this.getDefaultSize());
    };

    clearTimeout = (src) => {
        const timeout = this.timeouts[src];
        if (timeout) clearTimeout(timeout);
    };

    setTimeout = (src) => {
        this.clearTimeout(src);
        setTimeout(() => {
            this.setDefaultSize(src);
        }, this.props.timeout);
    };

    getDefaultSize = () => ({
        width: this.props.defaultWidth,
        height: this.props.defaultHeight
    });

    setDefaultSize = (src) => {
        this.onLoad(src, this.getDefaultSize());
    };

    componentDidUpdate() {

        const {items, image} = this.props;

        items.forEach(item => {

            const src = image(item);

            if (!!this.timeouts[src] || this.state.sizes[src]) return;

            if (!src) {
                this.setDefaultSize(src);
                return;
            }

            this.setTimeout(src);

        })

    }

    render() {

        const {items, image, children, defaultWidth, defaultHeight, onError, timeout, ...props} = this.props;

        return (
            <div {...props}>

                <span style={styles}>
                    {items.map(item => {

                        const src = image(item);

                        if (!src) return null;

                        return (
                            <img
                                key={src}
                                src={src}
                                alt={src}
                                onLoad={event => this.onLoad(src, event.target)}
                                onError={error => this.onLoadError(src, error)}
                            />
                        );

                    })}
                </span>

                {children(this.state)}

            </div>
        );

    }
}
