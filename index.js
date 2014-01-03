function StayDown(target, interval, max, callback) {
    this.target = target;
    this.interval = interval;
    this.intend_down = true;
    this.max = max || 0;
    this.callback = callback;
    this.userScroll = true;


    var staydown = this;

    this.emit('lock');

    var wheelevent = "wheel";
    if (document.onmousewheel !== undefined) {
        wheelevent = 'mousewheel';
    }

    window.addEventListener('resize', function (event) {
        staydown.emit('windowresize');
        staydown.checkdown();
    });

    this.target.addEventListener('scroll', function (event) {
        if (staydown.userScroll) {
            if (staydown.intend_down && !staydown.isdown()) {
                staydown.intend_down = false;
                staydown.emit('release');
            } else if (!staydown.indend_down && staydown.isdown()) {
                staydown.intend_down = true;
                staydown.emit('lock');
            }
        }
        staydown.userScroll = true;
    });

    function onImageLoad(event) {
        //image loads later, and isn't a mutation
        staydown.emit('imageload');
        staydown.checkdown();
        event.target.removeEventListener('load', onImageLoad);
    }

    if (window.MutationObserver) {
        //private function for getting images recursively from dom

        //mutation observer for whenever the overflow element changes
        this.mo = new MutationObserver(function (mutations) {
            staydown.userScroll = false;
            //something changed, check scroll
            staydown.checkdown();
            //check to see if image was added, and add onload check
            for (var idx = 0; idx < mutations.length; idx++) {
                var mut = mutations[idx];
                for (var nidx = 0; nidx < mut.addedNodes.length; nidx++) {
                    var imgs = mut.addedNodes[nidx].getElementsByTagName('img');
                    for (var iidx = 0, ilen = imgs.length; iidx < ilen; iidx++) {
                        imgs[iidx].addEventListener('load', onImageLoad);
                    }
                }
            }
        });
        this.mo.observe(this.target, {attributes: true, childList: true, characterData: true, subtree: true});
    } else {
        var checkdown = function () {
            staydown.checkdown();
            window.setTimeout(checkdown, staydown.interval);
        };
        checkdown();
    }

}

(function () {

    this.isdown = function () {
        return (this.target.scrollTop + this.target.clientHeight == this.target.scrollHeight);
    };

    this.append = function (newel) {
        this.emit('append');
        this.target.appendChild(newel);
        if (this.intend_down) {
            this.target.scrollTop = this.target.scrollHeight;
            this.emit('scrolldown');
        }
        while (this.max !== 0 && this.target.children.length > this.max) {
            this.target.removeChild(this.target.children[0]);
            this.emit('removechild');
        }
    };

    this.emit = function (type, msg) {
        if (typeof this.callback === 'function') {
            this.callback(type, msg);
        }
    };

    this.checkdown = function () {
        if (this.intend_down && 
            this.target.scrollTop + this.target.clientHeight != this.target.scrollHeight) {
            this.target.scrollTop = this.target.scrollHeight;
            this.userScroll = false;
            this.emit('scrolldown');
        }
    };

}).call(StayDown.prototype);

if (!module) {
    window.StayDown = StayDown;
} else {
    module.exports = StayDown;
}
