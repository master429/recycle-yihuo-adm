let AwesomeBase64 = require('awesome-urlsafe-base64');
var U = (function () {

    var str = (function () {

        var isNull = function (s) {
            return (typeof s === 'undefined' || s === null);
        };
        var isNotNull = function (s) {
            return !isNull(s);
        };

        var isEmpty = function (s) {
            if (isNull(s)) {
                return true;
            }
            if (typeof s != 'string') {
                return false;
            }
            return s.length === 0;
        };
        var isNotEmpty = function (s) {
            return !isEmpty(s);
        };

        var isNumber = function (s) {
            if (isEmpty(s)) {
                return false;
            }
            return /^[0-9]*$/.test(s);
        };

        var startsWith = function (s, prefix) {
            return s.indexOf(prefix) == 0;
        };

        var endsWith = function (str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };

        var replaceAll = function (s, s1, s2) {
            return s.replace(new RegExp(s1, "gm"), s2);
        };

        var trim = (s) => {
            return s.replace(/^\s+|\s+$/gm, '');
        };

        let isUrl = (s) => {
            if (isNotEmpty(s)) {
                let reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                if (reg.test(s)) {
                    return true;
                }
            }
            return false;
        };

        let isEmail = (s) => {
            if (isNotEmpty(s)) {
                let reg = /^([a-z0-9A-Z]+[-|\._]?)+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
                if (reg.test(s)) {
                    return true;
                }
            }
            return false;
        };

        let randomString = (len) => {
            let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let maxIndex = chars.length;
            let s = '';
            for (let i = 0; i < len; i++) {
                s += chars.charAt(Math.floor(Math.random() * maxIndex));
            }
            return s;
        };

        let isChinaMobile = (mobile) => {
            let cm_reg = /^1\d{10}$/;
            return isNotNull(mobile) && cm_reg.test(mobile);
        };
        let isNotChinaMobile = (mobile) => {
            return !isChinaMobile(mobile);

        };

        let isIdnum = (id) => {
            // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            return reg.test(id);
        };

        let isPassWord = (s) => {
            if (isNotEmpty(s)) {
                let reg = /^[a-zA-Z]\w{5,17}$/;
                if (reg.test(s)) {
                    return true;
                }
            }
            return false;
        };

        let trimChinaMobile = (mobile) => {
            if (mobile) {
                if (mobile.indexOf('-') > -1 && mobile.indexOf('86-') > -1) {
                    return mobile.split('-')[1];
                }
                return mobile;
            }
            return '';
        };

        let rn2arr = (str) => {
            str = str.replace(/(\r\n)|(\n)/g, '@');
            let ss = [];
            str.split('@').map((s) => {
                if (isNotEmpty(s)) {
                    ss.push(s);
                }
            });
            return ss;
        };

        let arr2rn = (arr) => {
            if (!arr || arr.length === 0) {
                return '';
            }
            return arr.join('\r\n');
        };
        let MobileLength = (mobile = '') => {
            console.log(mobile.length);
            return mobile.length === 11;
        };

        return {
            isNull: isNull,
            isNotNull: isNotNull,
            isEmpty: isEmpty,
            isNotEmpty: isNotEmpty,
            startsWith: startsWith,
            endsWith: endsWith,
            replaceAll: replaceAll,
            trim,
            isChinaMobile, isIdnum,
            isPassWord,
            isUrl,
            randomString,
            isNumber,
            trimChinaMobile,
            isEmail,
            rn2arr,
            arr2rn,
            MobileLength
        };
    })();

    var date = (function () {

        let getDateStratMillisecond = (date, separation) => {
            let strings = date.split(separation);
            let year = strings[0];
            let month = strings[1] - 1;
            let day = strings[2];
            return new Date(year, month, day).getTime();
        };
        let getDateEndMillisecond = (date, separation) => {
            let strings = date.split(separation);
            let year = strings[0];
            let month = strings[1] - 1;
            let day = strings[2];
            return new Date(year, month, day).getTime() + 24 * 60 * 60 * 1000 - 1;
        };

        var pad = function (n) {
            return n < 10 ? '0' + n : n;
        };

        var inAnHour = function (date) {
            var mins = parseInt((Math.floor(new Date()) - Math.floor(new Date(date))) / (1000 * 60));
            if (mins > -60)
                return true;
            return false;
        };

        var in24Hour = function (date) {
            var mins = parseInt((Math.floor(new Date()) - Math.floor(new Date(date))) / (1000 * 60));
            if (mins > -1440)
                return true;
            return false;
        };

        var countdownTimers = function (date) {
            var timers = [0, 0, 0, 0];
            var time = parseInt(Math.floor(new Date(date) - Math.floor(new Date())) / 1000 / 60);

            var mins = parseInt(time / 60);

            if (mins < 10) {
                timers[0] = 0;
                timers[1] = mins;
            } else {
                timers[0] = parseInt(mins / 10);
                timers[1] = parseInt(mins % 10);
            }

            var seconds = time % 60;
            if (seconds < 10) {
                timers[2] = 0;
                timers[3] = seconds;
            } else {
                timers[2] = parseInt(seconds / 10);
                timers[3] = parseInt(seconds % 10);
            }

            return timers;
        };

        var foreshowTimeout = function (timers) {

            if (timers[0] === 0 && timers[1] === 0 && timers[2] === 0 && timers[3] === 0) {
                return true;
            }
            return false;

        };

        var foreshowTimeouted = function (timers) {

            if (timers[0] <= 0 && timers[1] <= 0 && timers[2] <= 0 && timers[3] <= 0) {
                return true;
            }
            return false;

        };

        var seconds2HMS = function (time) {
            let h = 0,
                m = 0,
                s = 0,
                _h,
                _m,
                _s, ret = '';

            h = Math.floor(time / 3600);
            time = Math.floor(time % 3600);
            m = Math.floor(time / 60);
            s = Math.floor(time % 60);
            if (h > 0) {
                _h = h < 10 ? '0' + h : h;
                ret += _h + ':';
            }
            _s = s < 10 ? '0' + s : s;
            _m = m < 10 ? '0' + m : m;

            ret += _m + ':' + _s;

            return ret;
        };

        var format = function (date, fmt) {
            if (!date || !fmt) {
                return null;
            }
            var o = {
                "M+": date.getMonth() + 1, // 月份
                "d+": date.getDate(), // 日
                "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 小时
                "H+": date.getHours(), // 小时
                "m+": date.getMinutes(), // 分
                "s+": date.getSeconds(), // 秒
                "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
                "S": date.getMilliseconds()
            };
            var week = {
                "0": "\u65e5",
                "1": "\u4e00",
                "2": "\u4e8c",
                "3": "\u4e09",
                "4": "\u56db",
                "5": "\u4e94",
                "6": "\u516d"
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "")
                    .substr(4 - RegExp.$1.length));
            }
            if (/(E+)/.test(fmt)) {
                fmt = fmt
                    .replace(
                        RegExp.$1,
                        ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f"
                            : "\u5468")
                            : "")
                        + week[date.getDay() + ""]);
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1,
                        (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
                            .substr(("" + o[k]).length)));
                }
            }
            return fmt;
        };

        var formatISO8601 = function (d) {
            if (!d) {
                return null;
            }
            return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-'
                + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':'
                + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds())
                + 'Z';
        };
        var getInt = function (s) {
            var offset = 0;
            for (var i = 0; i < s.length; i++) {
                if (s.charAt(i) == '0') {
                    continue;
                }
                offset = i;
                break;
            }
            if (offset == 0) {
                return parseInt(s);
            }
            return parseInt(s.substr(offset));
        };
        var parse = function (v, timezoneOffset) {
            if (!v) {
                return null;
            }
            // yyyy-MM-ddTHH:mm:ssZ
            // yyyy-MM-ddTHH:mm:ss.SSSZ
            // yyyy-MM-dd HH:mm:ss.SSS
            var index = 0;
            var year = getInt(v.substr(index, 4));
            index += 5;
            var month = getInt(v.substr(index, 2)) - 1;
            index += 3;
            var day = getInt(v.substr(index, 2));
            index += 3;
            var hour = index >= v.length ? 0 : getInt(v.substr(index, 2));
            index += 3;
            var minute = index >= v.length ? 0 : getInt(v.substr(index, 2));
            index += 3;
            var second = index >= v.length ? 0 : getInt(v.substr(index, 2));
            // TODO more format
            if (v.charAt(v.length - 1) == 'Z') {
                var millSecond = v.indexOf('.') > 0 ? getInt(v.substring(v
                    .indexOf('.') + 1, v.length - 1)) : 0;
                var d = new Date();
                d.setUTCFullYear(year);
                d.setUTCMonth(month);
                d.setUTCDate(day);
                d.setUTCHours(hour);
                d.setUTCMinutes(minute);
                d.setUTCSeconds(second);
                d.setUTCMilliseconds(millSecond);
                return d;
            } else {
                var millSecond = v.indexOf('.') > 0 ? getInt(v.substring(v
                    .indexOf('.') + 1)) : 0;
                var date = new Date(year, month, day, hour, minute, second,
                    millSecond);
                if (!str.isNull(timezoneOffset)) {
                    var diff = timezoneOffset - date.getTimezoneOffset();
                    date.setTime(date.getTime() - diff * 60 * 1000);
                }
                return date;
            }
        };

        let isToday = function (date) {
            let d = U.date.format(U.date.parse(date), 'yyyy-MM-dd');
            let today = U.date.format(new Date(), 'yyyy-MM-dd');
            return d === today;
        };

        let daysDiff = (t1, t2) => {
            return Math.floor((t1 - t2) / 86400000);
        };

        let duration2Str = (duration, options) => {
            let units = {
                'I': '分钟',
                'H': '小时',
                'D': '天',
                'W': '周',
                'M': '个月',
                'Y': '年'
            };
            if (str.isEmpty(duration) || duration.length < 2) {
                return options && options.defaultStr || '--';
            } else {
                let length = duration.length;
                let unit = duration.substring(length - 1);
                let num = parseInt(duration.substring(0, length - 1));
                if (duration === '1S') {
                    return '无';
                } else if (num === 0) {
                    return '永久';
                } else {
                    let prefix = options && options.prefix || '';
                    return prefix + num + units[unit];
                }
            }
        };

        return {
            pad,
            parse: parse,
            inAnHour: inAnHour,
            in24Hour: in24Hour,
            seconds2HMS: seconds2HMS,
            countdownTimers: countdownTimers,
            foreshowTimeout: foreshowTimeout,
            foreshowTimeouted: foreshowTimeouted,
            format: format,
            isToday,
            getDateStratMillisecond: getDateStratMillisecond,
            getDateEndMillisecond: getDateEndMillisecond,
            formatISO8601: formatISO8601,
            daysDiff, duration2Str
        };
    })();

    let array = (function () {
        let swap = function (arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        };

        let remove = function (arr, index) {
            if (isNaN(index) || index > arr.length) {
                return [];
            }
            arr.splice(index, 1);
            return arr;
        };

        let insert = function (arr, index, item) {
            arr.splice(index, 0, item);
            return arr;
        };

        let insertLast = function (arr, item) {
            arr.splice(arr.length, 0, item);
            return arr;
        };

        let unique = (arr) => {
            const res = new Map();
            return arr.filter((a) => !res.has(a) && res.set(a, 1));
        };

        return {
            swap, remove, insert, insertLast, unique
        };
    })();

    var getHashParameter = function (name) {
        var hash = window.location.hash;
        if (!hash) {
            return null;
        }
        var offset = hash.indexOf('?');
        if (offset < 0) {
            return null;
        }
        hash = hash.substr(offset + 1);
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = hash.match(reg);
        if (r == null) {
            return null;
        }
        return unescape(r[2]);
    };
    var getParameter = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    };
    var getVisitNumber = function (num) {
        let val = parseInt(num);
        if (val < 1000) {
            return val;
        }
        if (val > 1000 && val < 10000) {
            return '>' + val;
        }
        if (val > 10000) {
            return '>1万';
        }
    };

    var getDomainFromUrl = function (url) {
        var offset = url.indexOf("//");
        var offset2 = url.indexOf("/", offset + 2);
        if (offset2 == -1) {
            return url.substring(offset + 2);
        }
        return url.substring(offset + 2, offset2);
    };


    let htmlstr = (() => {

        let components2pureHtml = (cs) => {
            let html = '';
            cs.map((c, index) => {
                if (c.type === 1) {
                    if (c.text.length > 0) {
                        let text = c.text;
                        text = text.replace(/<[^>]+>/g, "");
                        text = text.replace(/\r\n/g, "<br/>");
                        text = text.replace(/\n/g, "<br/>");
                        text = text.replace(/\s/g, "&nbsp;");
                        html += '<p>' + text + '</p>';
                    }
                } else {
                    if (c.url !== '')
                        html += '<img src="' + c.url + '"/>';
                }
            });
            return html;
        };

        let html2components = (html) => {
            let div = document.createElement("div");
            div.innerHTML = html;
            let nodes = div.childNodes;
            let cs = [];
            for (let i = 0; i < nodes.length; i++) {
                let n = nodes[i];
                let name = n.nodeName.toLowerCase();
                if (name === 'p') {

                    let html = n.innerHTML.toLowerCase();
                    html = html.replace(/(<br\/>|<br>)/g, '\r\n');
                    html = html.replace(/&nbsp;/g, ' ');

                    cs.push({ type: 1, text: html });
                } else if (name === 'img') {
                    cs.push({ type: 2, url: n.src });
                }
            }
            return cs;
        };

        return {
            components2pureHtml, html2components
        };

    })();

    let base64 = (() => {
        let getBlobBydataURI = (dataURI, type) => {
            let binary = atob(dataURI.split(',')[1]);
            let array = [];
            for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], { type: type });
        };

        let toFile = function (dataURL) {
            var arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            var offset = mime.indexOf('/');
            var suffix = offset > 0 ? mime.substring(offset + 1) : null;
            var fileName = suffix ? '1.' + suffix : '1';
            return new File([u8arr], fileName, { type: mime });
        };

        let encode = (str) => {
            return AwesomeBase64.encode(new Buffer(str));
        };

        let encodeUtf8 = (str) => {
            return AwesomeBase64.encode(new Buffer(encodeURIComponent(str)));
        };

        return { getBlobBydataURI, toFile, encode, encodeUtf8 };
    })();

    let toFixed = (num, s) => {
        if (!(num.toString() === '-' || num.toString() === '+')) {
            let times = Math.pow(10, s);
            let offset = num > 0 ? 0.5 : -0.5;
            let des = num * times + offset;
            des = parseInt(des, 10) / times;
            return des + '';
        }
        return num;
    };

    let num = (() => {

        let convertBigDecimal = function (num) {
            if (num > 10000) {
                return (num / 10000).toFixed(1) + '万';
            }
            return num;
        };

        let formatPrice = (price = 0, withoutPrefix) => {
            if (isNaN(price)) {
                price = 0;
            }
            price = (Math.round(price) / 100);
            if (withoutPrefix) {
                return price;
            }
            return '￥' + price;
        };

        var formatCurrency = function (s, n) {
            if (s) {
                /*
                 * 参数说明：
                 * s：要格式化的数字
                 * n：保留几位小数
                 * */
                n = n > 0 && n <= 20 ? n : 2;
                s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
                var l = s.split(".")[0].split("").reverse(),
                    r = s.split(".")[1];
                let t = "";
                for (let i = 0; i < l.length; i++) {
                    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
                }
                return t.split("").reverse().join("") + "." + r;
            } else {
                return 0;
            }

        };

        return { convertBigDecimal, formatPrice, formatCurrency };
    })();

    return {
        htmlstr,
        str,
        date,
        array,
        getParameter: getParameter,
        getHashParameter: getHashParameter,
        getVisitNumber: getVisitNumber,
        getDomainFromUrl: getDomainFromUrl,
        base64, toFixed, num
    };
})();

export default U;
