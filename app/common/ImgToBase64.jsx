import App from "./App.jsx";

var ImgToBase64 = function (options, cb, fail) {
    var img = document.createElement('img');
    img.crossOrigin = 'Anonymous';
    //document.body.appendChild(img);
    img.onload = function () {
        var canvas = document.createElement('canvas');
        //var computedStyle = window.getComputedStyle(img, null);
        canvas.width = this.width; //computedStyle.getPropertyValue('width').split('px')[0];
        canvas.height = this.height; //computedStyle.getPropertyValue('height').split('px')[0];
        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        var imgDataUrl = canvas.toDataURL("image/png", 1.0);
        //document.body.removeChild(img);
        cb(imgDataUrl);
    };
    img.onerror = function () {
        //document.body.removeChild(img);
        App.api('/common/file/img_to_base64', {url: options.url}).then((data) => {
            cb(data);
        }, (err) => {
            fail && fail(err);
        });
    };
    img.src = options.url;
    if (img.complete || img.complete === undefined) {
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = options.url;
    }
};

export default ImgToBase64;
