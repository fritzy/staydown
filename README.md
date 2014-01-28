#StayDown

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

    var staydown = new StayDown({
        target: scrolling_element,
        interval: millisecond_check,
        max: max_items,
        spinner: image_src,
        callback: event_callback
    });
    sd.append(new_element);

##Install

    npm install staydown

##Events:

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

When the browser doesn't have Mutation Observer support, a check interval is used for the case of
images or dom mutations happening without using the this StayDown's append function.
