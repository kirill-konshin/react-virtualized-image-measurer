import React from "react";
import {
    CellMeasurer,
    CellMeasurerCache,
    createMasonryCellPositioner,
    Masonry
} from "react-virtualized";
import ImageMeasurer from "../src";
import list from "./data"; // an array of images with titles

const noCacheList = list.map((item, index) => ({
    title: index + '. ' + item.title,
    image: item.image + (item.image ? "?noCache=" + Math.random() : '')
}));

const columnWidth = 200;
const defaultHeight = 250;
const defaultWidth = columnWidth;

// Default sizes help Masonry decide how many images to batch-measure
const cache = new CellMeasurerCache({
    defaultHeight,
    defaultWidth,
    fixedWidth: true
});

// Our masonry layout will use 3 columns with a 10px gutter between
const cellPositioner = createMasonryCellPositioner({
    cellMeasurerCache: cache,
    columnCount: 3,
    columnWidth,
    spacer: 10
});

const MasonryComponent = ({itemsWithSizes}) => {

    function cellRenderer({index, key, parent, style}) {
        const {item, size} = itemsWithSizes[index];
        const height = columnWidth * (size.height / size.width) || defaultHeight;

        return (
            <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
                <div style={style}>
                    <div>{item.title}</div>
                    {item.image && (
                        <img
                            src={item.image}
                            alt={item.title}
                            style={{
                                height: height,
                                width: columnWidth,
                                display: 'block'
                            }}
                        />
                    )}
                </div>
            </CellMeasurer>
        );
    }

    return (
        <Masonry
            cellCount={itemsWithSizes.length}
            cellMeasurerCache={cache}
            cellPositioner={cellPositioner}
            cellRenderer={cellRenderer}
            height={600}
            width={800}
        />
    );
};

export default class Index extends React.Component {
    static getInitialProps() {
        return {
            noCacheList: noCacheList
        };
    }

    render() {
        return (
            <ImageMeasurer
                items={this.props.noCacheList}
                image={item => item.image}
                defaultHeight={defaultHeight}
                defaultWidth={defaultWidth}
            >
                {({itemsWithSizes}) => (
                    <MasonryComponent itemsWithSizes={itemsWithSizes}/>
                )}
            </ImageMeasurer>
        );
    }
}