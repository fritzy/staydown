function StayDown(target, interval, max, callback) {
    this.target = target;
    this.interval = interval;
    this.intend_down = true;
    this.max = max || 0;
    this.callback = callback;
    

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

    this.target.addEventListener(wheelevent, function (event) {
        var delta = event.deltaY;
        if (
            !staydown.intend_down &&
            delta > 0 &&
            staydown.target.scrollTop + staydown.target.clientHeight == staydown.target.scrollHeight
        ) {
            staydown.intend_down = true;
            staydown.emit('lock');
        } else if (staydown.intend_down && delta < 0) {
            staydown.intend_down = false;
            staydown.emit('release');
        }
    });
        
    function checkForImage(el, imgs) {
        var idx;
        imgs = imgs || [];
        if (el.nodeName === 'img' || el.nodeName === 'IMG') {
            return [el];
        } else {
            for (idx = 0; idx < el.children.length; idx++) {
                imgs = imgs.concat(checkForImage(el.children[idx], imgs));
            }
            return imgs;
        }

    }

    if (window.MutationObserver) {
        //private function for getting images recursively from dom

        //mutation observer for whenever the overflow element changes
        this.mo = new MutationObserver(function (mutations) {
            //something changed, check scroll
            staydown.checkdown();
            //check to see if image was added, and add onload check
            for (var idx = 0; idx < mutations.length; idx++) {
                var mut = mutations[idx];
                for (var nidx = 0; nidx < mut.addedNodes.length; nidx++) {
                    var imgs = checkForImage(mut.addedNodes[nidx]);
                    imgs.forEach(function (img) {
                        img.onload = function () {
                            //image loads in later, doesn't count as mutation, so we check scroll now
                            staydown.emit('imageload');
                            staydown.checkdown();
                        };
                    });
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
            this.emit('scrolldown');
        }
    };

}).call(StayDown.prototype);

window.StayDown = StayDown;
