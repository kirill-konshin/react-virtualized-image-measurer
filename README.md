# Image Preloader for React & React Virtualized

## Installation

```sh
$ npm install react-virtualized-image-measurer --save-dev
```

## Live Demo

https://codesandbox.io/s/7y66p25qv6

## Usage

Component accepts an array of items, tries to extract an image from each item using `image` callback prop,
then loads the image, measures it and provides the outcome to `children` render-prop.

```js
const list = [
    {
        image: 'http://...',
        title: 'Foo'      
    }
    //...more
];

export default () => (
    <ImageMeasurer
        items={list}
        image={item => item.image}
        defaultHeight={100}
        defaultWidth={100}
    >
        {({itemsWithSizes, sizes}) => (
            // itemsWithSizes = [{item: listItem, size: {width: x, height: x}]
            // sizes = {'src': {width: x, height: x}}
            <MasonryComponent itemsWithSizes={itemsWithSizes}/>
        )}
    </ImageMeasurer>
);
```

## Error Handling

You can return custom width and height from `onError` callback prop. If nothing was returned `defaultWidth` and
`defaultHeight` will be used.

```js
export default () => (
    <ImageMeasurer
        onError={(event, item, src) => {
            console.error('Cannot load image', src, 'for item', item, 'event', event);
            return {width: 100, height: 100};
        }}
    >...</ImageMeasurer>
);
```

## Filtering of original array

You should not do anything extra if you simply add items to the end of original array. But if you filter items, change
their order or insert items in the middle (basically anything that affect old items positioning), you have to manually
reset `Masonry` caches due to it's optimizations.

To do that you will have to save `Masonry`'s `ref` somewhere:

```js
const setRef = (node) => masonryRef = node;
<Masonry ref={setRef}/>
```

And using this `ref` call following methods:

```js
cellMeasurerCache.clearAll();
cellPositioner.reset(cellPositionerConfig);
masonryRef.clearCellPositions();
```

## Keys

You can supply a custom key extractor callback prop in case you have duplicates in your array:

```js
export default () => (
    <ImageMeasurer
        keyMapper={(item, index) => item.id}
    >...</ImageMeasurer>
);
```
