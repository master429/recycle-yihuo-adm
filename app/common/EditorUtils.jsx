import {ImgToBase64, OSSWrap, U} from "./index";

let hostDomains = ['fs.maidaotech.cn'];

let isHostFile = (url, callback) => {
    if (url.indexOf('http:') === 0 || url.indexOf('https:') === 0) {
        let domain = U.getDomainFromUrl(url);
        for (let i = 0; i < hostDomains.length; i++) {
            if (hostDomains[i] === domain) {
                callback(true);
                return;
            }
        }
        callback(false);
    } else {
        callback(false);
    }
};

let EditorUtils = {
    parseContent: function (html, options, callback) {
        let el = document.createElement('div');
        el.innerHTML = html;
        let uploadImg = function (url) {
            return new Promise(function (resolve, reject) {
                try {
                    ImgToBase64({url: url}, (base64) => {
                        let file;
                        try {
                            file = U.base64.toFile(base64);
                        } catch (e) {
                            reject(e);
                            return;
                        }
                        console.log('Ready to upload image: ', file);
                        OSSWrap.upload(file).then(resolve).catch(reject);
                    }, reject);
                } catch (e) {
                    reject(e);
                }
            });
        };
        let getAttr = function (item, attr) {
            if (attr == 'backgroundImage') {
                let img = item.style.backgroundImage;
                // background-image: url("http://xx")
                let offset = img.indexOf('url(');
                if (offset !== 0) {
                    return null;
                }
                return img.substring(5, img.length - 2);
            } else {
                return item[attr];
            }
        };
        let setAttr = function (item, attr, val) {
            if (attr == 'backgroundImage') {
                item.style.backgroundImage = 'url(' + val + ')';
            } else {
                item[attr] = val;
            }
        };
        let uploads = function (items, attr, success) {
            if (items.length == 0) {
                success();
                return;
            }
            let uploadIndex = 0;
            let uploadChain = function () {
                if (uploadIndex >= items.length) {
                    success();
                    return;
                }
                let item = items[uploadIndex];
                uploadIndex++;
                let src = getAttr(item, attr);
                if (!src) {
                    uploadChain();
                    return;
                }
                isHostFile(src, (isHost) => {
                    if (isHost) {
                        uploadChain();
                        return;
                    }
                    uploadImg(src).then((result) => {
                        setAttr(item, attr, result.url);
                        uploadChain();
                    }, (e) => {
                        // ignore
                        console.log(e || ('Failed to upload img: ' + src));
                        // continue next img uploading
                        uploadChain();
                    });
                });
            };
            uploadChain();
        };
        // images
        let imgs = el.getElementsByTagName('img');
        uploads(imgs, 'src', () => {
            // style="background: url(xx)"  or  style="background-image:url(xx)"
            uploads(el.querySelectorAll('[style*=background]'), 'backgroundImage', () => {
                callback(el.innerHTML);
            });
        });
    }
};


export default EditorUtils;

