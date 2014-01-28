var StayDown = require('./index');
var scrolldom = document.getElementById('scrollarea');
var inputdom = document.getElementById('input');
var sd = new StayDown({target: scrolldom, interval: 5000, max: 11, spinner: 'spinner.gif', callback: function (event, msg) { console.log(event); }});
inputdom.addEventListener('keydown', function (event) {
    var newp, text, img;
    if (event.which === 13) {
        //event.preventDefault();
        newp = document.createElement('p');
        text = document.createTextNode(inputdom.value);
        newp.appendChild(text);
        inputdom.value = '';
        sd.append(newp);
    }
    if (event.which === 17) {
        newp = document.createElement('p');
        img = new Image();
        img.src = 'http://upload.wikimedia.org/wikipedia/commons/f/f7/Fiji_Banded_Iguana.jpg';
        newp.appendChild(img);
        sd.append(newp);
    }
});
