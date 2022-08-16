import {message} from 'antd';
import KvStorage from './KvStorage.jsx';
import {U, Utils} from "./index";
import AdminProfile from "../components/admin/AdminProfile";

const hashHistory = require('history').createHashHistory();

let ENV_CONFIG;
if (process.env.API_ENV == 'dev') {
    ENV_CONFIG = require('./env/dev').default;
}

if (process.env.API_ENV == 'sandbox') {
    ENV_CONFIG = require('./env/sandbox').default;
}

if (process.env.API_ENV == 'prod') {
    ENV_CONFIG = require('./env/prod').default;
}

const API_BASE = window.location.protocol + ENV_CONFIG.api;
const PORTAL_MOB = ENV_CONFIG.portal_mob;
const PORTAL_PC = ENV_CONFIG.portal_pc;
let saveCookie = (k, v) => KvStorage.set(k, v);
let getCookie = (k) => KvStorage.get(k);
let removeCookie = (k) => KvStorage.remove(k);

const go = function (hash) {
    hashHistory.push(hash);
};

let logout = () => {
    removeCookie('admin-token');
    removeCookie('admin-profile');
    Utils.adm.clearPermissions();
    AdminProfile.clear();
};

const api = (path, params, options) => {
    params = params || {};
    options = options || {};

    if (options.requireSession === undefined) {
        options.requireSession = true;
    }
    if (options.defaultErrorProcess === undefined) {
        options.defaultErrorProcess = true;
    }

    let defaultError = {'errcode': 600, 'errmsg': '网络错误'};
    let apiPromise = function (resolve, reject) {
        let rejectWrap = reject;

        if (options.defaultErrorProcess) {
            rejectWrap = function (ret) {
                let {errmsg} = ret;
                message.error(errmsg);
                reject(ret);
            };
        }
        var apiUrl = API_BASE + path;

        var token = getCookie('admin-token');
        if (U.str.isNotEmpty(token)) {
            params['admin-token'] = token;
        }

        let dataStr = '';
        for (let key in params) {
            if (dataStr.length > 0) {
                dataStr += '&';
            }
            if (params.hasOwnProperty(key)) {
                let value = params[key];
                if (value === undefined || value === null) {
                    value = '';
                }
                dataStr += (key + '=' + encodeURIComponent(value));
            }
        }
        if (dataStr.length === 0) {
            dataStr = null;
        }

        fetch(apiUrl, {
            method: 'POST',
            body: dataStr,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (response) {
            response.json().then(function (ret) {
                var errcode = ret.errcode;
                if (errcode) {
                    if (errcode === 5) {
                        logout();
                        go('/login');
                        return;
                    }
                    rejectWrap(ret);
                    return;
                }
                resolve(ret.result);
            }, function () {
                rejectWrap(defaultError);
            });
        }, function () {
            rejectWrap(defaultError);
        }).catch(() => {
        });
    };

    return new Promise(apiPromise);

};

let getAdmProfile = function () {
    return JSON.parse(getCookie('admin-profile') || '{}');
};

let getAdminToken = function () {
    return getCookie('admin-token');
};

export default {
    go, api, API_BASE, logout, getAdmProfile, getAdminToken, PORTAL_MOB, PORTAL_PC
};
