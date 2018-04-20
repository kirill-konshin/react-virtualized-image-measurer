# Image Preloader for React & React Virtualized

## Installation

```sh
$ npm install react-virtualized-image-measurer --save-dev
```

## Live Demo

https://codesandbox.io/s/7y66p25qv6

## Usage

Component accepts an array of items, tries to extract an image from each item using `image` prop,
then loads the image, measures it and provides the outcome to `children` render-prop.

```js
const list = [
    {
        image: 'http://...',
        title: 'Foo'      
    },
    //...more
];

export default () => (
    <ImageMeasurer
        items={list}
        image={item => item.image}
        defaultHeight={100}
        defaultWidth={100}
    >
        {({itemsWithSizes}) => ( // itemsWithSizes = [{item: listItem, size: {width: x, height: x}]
            <MasonryComponent itemsWithSizes={itemsWithSizes}/>
        )}
    </ImageMeasurer>
);
```

TBD, see `pages/index.js`.