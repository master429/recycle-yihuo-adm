import cookie from 'react-cookie';

var gOptions = {
    localStorageEnabled: true,
    cookieEnabled: false,
    sessionStorageEnabled: true
};
var gMap = {};

var isNull = function (v) {
    if (v === undefined || v === null) {
        return true;
    }
    if (typeof v == 'string') {
        return v.length == 0;
    }
    return false;
};
var removeStorage = function (storage, key) {
    try {
        if (!storage) {
            return false;
        }
        storage.removeItem(key);
        storage.removeItem('__expire__' + key);
        return true;
    } catch (e) {
        return false;
    }
};
var getStorage = function (storage, key) {
    try {
        if (!storage) {
            return null;
        }
        var expires = storage.getItem('__expire__' + key);
        if (isNull(expires)) {
            expires = -1;
        } else {
            expires = Number(expires);
        }
        if (expires < Date.now()) {
            removeStorage(storage, key);
            return null;
        } else {
            return storage.getItem(key);
        }
    } catch (e) {
        return null;
    }
};
var setStorage = function (storage, key, value, options) {
    try {
        if (!storage) {
            return false;
        }
        let expiresIn = options.expiresIn;
        if (isNull(expiresIn)) {
            expiresIn = 86400 * 30;  // default: seconds for 30 day
        } else {
            expiresIn = Math.abs(expiresIn);
        }
        var expires = Date.now() + expiresIn * 1000;
        storage.setItem('__expire__' + key, expires);
        storage.setItem(key, value);
        return true;
    } catch (e) {
        return false;
    }
};
var getCookie = function (k) {
    if (!gOptions.cookieEnabled) {
        return null;
    }
    return cookie.load(k);
};
var setCookie = function (k, v, options) {
    if (!gOptions.cookieEnabled) {
        return false;
    }
    cookie.save(k, v, {
        path: '/',
        expires: options.expiresIn ? new Date(Date.now() + options.expiresIn * 1000) : null
    });
    //test whether cookie is saved
    if (cookie.load(k) === v) {
        return true;
    }
    return false;
};
var removeCookie = function (k) {
    try {
        cookie.remove(k);
        return true;
    } catch (e) {
        return false;
    }
};
// prefer localStorage > cookie > sessionStorage > memory
var KvStorage = {
    setOptions: function (options) {
        for (var key in options) {
            gOptions[key] = options[key];
        }
    },
    get: function (k) {
        let v;
        v = getStorage(gOptions.localStorageEnabled ? window.localStorage : null, k);
        if (!isNull(v)) {
            return v;
        }
        v = getCookie(k);
        if (!isNull(v)) {
            return v;
        }
        v = getStorage(gOptions.sessionStorageEnabled ? window.sessionStorage : null, k);
        if (!isNull(v)) {
            return v;
        }
        v = gMap[k];
        return v;
    },
    set: function (k, v, options) {
        if (isNull(v)) {
            return false;
        }
        if (typeof v != 'string') {
            v = v.toString();
        }
        options = options || {};
        var saved = false;
        saved = setStorage(gOptions.localStorageEnabled ? window.localStorage : null, k, v, options);
        if (saved) {
            return true;
        }
        saved = setCookie(k, v, options);
        if (saved) {
            return true;
        }
        saved = setStorage(gOptions.sessionStorageEnabled ? window.sessionStorage : null, k, v, options);
        if (saved) {
            return true;
        }
        gMap[k] = v;
        return true;
    },
    remove: function (k) {
        removeStorage(window.localStorage, k);
        removeCookie(k);
        removeStorage(window.sessionStorage, k);
        delete gMap[k];
    }
};

export default KvStorage;