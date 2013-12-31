#StayDown

Logs and chats often have the style of appending new lines to the bottom, and keeping
scrolling pinned to the bottom, unless a user indicates intention not to keep it
pinned to the bottom by scrolling up from the bottom.

StayDown keeps track of user intention for pinning the element scroll to the bottom,
as elements are added, and checks at an interval.
When a user scrolls up, StayDown stops scrolling down for the user, but re-initializes
when the user scrolls back down to the bottom.

    var staydown = new StayDown(scrolling_element, millisecond_check, max_items, event_callback);
    sd.append(new_element);

##Events:

The event callback is called with an event type whenever ScrollDown does something.

* lock: lock to the bottom (at the beginning and when user scrolls back down)
* release: release from the bottom (usually due to user scroll up)
* scrolldown: whenever the view is scrolled down by StayDown
* append: when an element is appended
* checkfailed: when the interval check happens, it isn't scrolled down, and it is locked
* removechild: when max items have been exceeded, and topmost child is removed

## Why Timed Checks?

HTML5 does not have mutation events.
If something changes the scrollheight of the target without going through
StayDown, there is no way of knowing.
Say an image loads in, or something is added to the dom through another method,
we need to occasionally check to make sure that the element is scrolled to the bottom.
