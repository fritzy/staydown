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

    console.log(wheelevent);

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

    var checkdown = function () {
        if (staydown.intend_down && 
            staydown.target.scrollTop + staydown.target.clientHeight != staydown.target.scrollHeight) {
            staydown.target.scrollTop = staydown.target.scrollHeight;
            staydown.emit('checkfailed');
            staydown.emit('scrolldown');
        }
        window.setTimeout(checkdown, staydown.interval);
    };
    checkdown();
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

}).call(StayDown.prototype);

window.StayDown = StayDown;
