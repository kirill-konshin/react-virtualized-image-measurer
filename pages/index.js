import React, {PureComponent} from "react";
import {
    AutoSizer,
    CellMeasurer,
    CellMeasurerCache,
    createMasonryCellPositioner,
    Masonry,
    WindowScroller
} from "react-virtualized";
import list from "./components/data";
import Card from "./components/Card";
import ImageMeasurer from "../src/index";

const spacer = 20;
const columnCount = 3;
const defaultHeight = 250;
const maxHeight = 300;

export default class Page extends PureComponent {

    state = {data: []};
    columnWidth = 250;
    masonryRef;
    cellPositioner = null;

    cache = new CellMeasurerCache({
        defaultHeight: defaultHeight,
        defaultWidth: this.columnWidth,
        fixedWidth: true
    });

    getCellPositioner = width => {
        this.setColumnWidth(width);
        if (!this.cellPositioner) {
            this.cellPositioner = createMasonryCellPositioner({
                cellMeasurerCache: this.cache,
                columnCount,
                columnWidth: this.columnWidth,
                spacer
            });
        }
        return this.cellPositioner;
    };

    setColumnWidth = width => {
        this.columnWidth = Math.floor((width - spacer * (columnCount - 1)) / columnCount);
    };

    onResize = ({width}) => {
        this.getCellPositioner(width);

        this.cache.clearAll();

        this.cellPositioner.reset({
            columnCount,
            columnWidth: this.columnWidth,
            spacer
        });

        //masonryRef.recomputeCellPositions();
        this.masonryRef.clearCellPositions();
    };


    renderMasonry(itemsWithSizes){
        return (
            <WindowScroller>
                {({height, scrollTop, isScrolling}) => (
                    <AutoSizer
                        disableHeight
                        height={height}
                        scrollTop={scrollTop}
                        onResize={this.onResize}
                    >
                        {({width}) => (
                            <Masonry
                                autoHeight
                                cellCount={itemsWithSizes.length}
                                cellMeasurerCache={this.cache}
                                cellPositioner={this.getCellPositioner(width)}
                                cellRenderer={this.cellRenderer.bind(this, itemsWithSizes)}
                                isScrolling={isScrolling}
                                scrollTop={scrollTop}
                                width={width}
                                height={height}
                                ref={ref => (this.masonryRef = ref)}
                            />
                        )}
                    </AutoSizer>
                )}
            </WindowScroller>
        );

    }

    cellRenderer = (itemsWithSizes, {index, key, parent, style}) => {
        const {item, size} = itemsWithSizes[index];

        style.width = this.columnWidth + "px"; //FIXME NASTY HACK

        let desiredHeight = defaultHeight;

        if (size) {
            desiredHeight = Math.floor(size.height / size.width * this.columnWidth);
            if (desiredHeight > maxHeight) desiredHeight = maxHeight;
        }

        return (
            <CellMeasurer cache={this.cache} index={index} key={key} parent={parent}>
                {({measure}) => (
                    <div style={style}>
                        <Card
                            title={index + item.title}
                            image={item.image}
                            size={{
                                height: desiredHeight + "px"
                            }}
                        />
                    </div>
                )}
            </CellMeasurer>
        );
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                data: list.map(item => ({
                    ...item,
                    image: item.image + "?noCache=" + Math.random()
                }))
            }); // emulate server response
        }, 1000);
    }

    render() {
        if (!this.state.data.length) return <div>Loading</div>;
        return (
            <ImageMeasurer
                items={this.state.data}
                image={item => item.image}
                defaultWidth={this.columnWidth}
                defaultHeight={defaultHeight}
            >
                {({itemsWithSizes}) => this.renderMasonry(itemsWithSizes)}
            </ImageMeasurer>
        );
    }
}
