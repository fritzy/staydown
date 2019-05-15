# StayDown

Logs and chats often have the style of appending new lines to the bottom, and keeping
scrolling pinned to the bottom, unless a user indicates intention not to keep it
pinned to the bottom by scrolling up from the bottom.
Images add a complication, as they are added to the dom, but later change the size
of the overflow.
StayDown looks at all added element trees for images, and checks the scrolling again
when the image has finished loading.

StayDown keeps track of user intention for pinning the element scroll to the bottom,
as elements are added, and checks at an interval.
When a user scrolls up, StayDown stops scrolling down for the user, but re-initializes
when the user scrolls back down to the bottom.

Optionally, images can be replaced with a "spinner" loading image to make image loading
a better user experience. Otherwise, loading images can resize and not scroll down
until they are finished loading.

## Install

[![NPM](https://nodei.co/npm/staydown.png?compact=true)](https://npmjs.org/package/staydown)
![](https://img.shields.io/npm/dm/staydown.svg)

## Module

You can `require` this as a CommonJS module.

```js
const StayDown = require('staydown');
```

Or you can `import` this as a ES6/ECMAScript 2016 module.

```js
import StayDown from 'staydown';
```

## Example

```js
const staydown = new StayDown({
    target: scrolling_element,
    interval: 1000,
    max: 50,
    spinner: "https://i1.wp.com/cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif",
    stickyHeight: 10,
    callback: function (event, msg) {
      console.log("got event:", event);
      console.log("event msg:", msg);
    }
});
staydown.append(new_element);
```

## Options

| Option       | Required | Default | Description                                              |
|--------------|:--------:|--------:|----------------------------------------------------------|
| target       |        ✓ | None    | Target Element                                           |
| interval     |        ✗ | 1000    | Milliseconds to check if MutationObserver is unsupported |
| spinner      |        ✗ | None    | URL to spinner image (gif)                               |
| max          |        ✗ | 0       | If not 0, remove oldest elements greater than `max` old  |
| stickyHeight |        ✗ | 10      | Number of pixels to consider bottom from bottom          |
| callback     |        ✗ | None    | function (eventType, msg)                                |


## Events:

The event callback is called with an event type whenever ScrollDown does something.

* lock: lock to the bottom (at the beginning and when user scrolls back down)
* release: release from the bottom (usually due to user scroll up)
* scrolldown: whenever the view is scrolled down by StayDown
* append: when an element is appended
* checkfailed: when the interval check happens, it isn't scrolled down, and it is locked
* removechild: when max items have been exceeded, and topmost child is removed
* imageload: when an image loads in the overflow element, scrolling is checked
* windowresize: when the window is resized, scrolling is checked

## Occasional Check

When the browser doesn't have Mutation Observer support, a check `interval` is used for the case of
images or dom mutations happening without using the this StayDown's append function.

## Building

```sh
git clone git@github.com:fritzy/staydown.git
cd staydown
npm install
npm run build
```

## License

The MIT License (MIT)

Copyright (c) 2014-2019 Nathanael C. Fritz
