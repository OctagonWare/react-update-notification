import { useCallback, useEffect, useState } from 'react';
import { UpdateStatus, } from './types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
var reloadPage = function () { return window.location.reload(true); };
var currentVersion = window.__APP_VERSION__;
export var useUpdateCheck = function (_a) {
    var interval = _a.interval, type = _a.type, ignoreServerCache = _a.ignoreServerCache;
    var _b = useState(UpdateStatus.checking), status = _b[0], setStatus = _b[1];
    var checkUpdate = useCallback(function () {
        if (typeof currentVersion === 'undefined') {
            setStatus(UpdateStatus.current);
            return;
        }
        setStatus(UpdateStatus.checking);
        var requestStr = "/".concat(window.__APP_VERSION_FILE__);
        if (ignoreServerCache) {
            requestStr += "?v=".concat(Date.now());
        }
        fetch(requestStr)
            .then(function (res) { return res.json(); })
            .then(function (data) {
            if (data.version === currentVersion) {
                setStatus(UpdateStatus.current);
            }
            else {
                setStatus(UpdateStatus.available);
            }
        })
            .catch(function () {
            setStatus(UpdateStatus.current);
        });
    }, [ignoreServerCache]);
    useEffect(function () {
        if (type !== 'manual') {
            checkUpdate();
        }
    }, [checkUpdate, type]);
    useEffect(function () {
        if (status !== UpdateStatus.current) {
            return;
        }
        if (type === 'interval') {
            var timeoutId_1 = window.setTimeout(function () { return checkUpdate(); }, interval || 10000);
            return function () {
                window.clearTimeout(timeoutId_1);
            };
        }
    }, [type, interval, status, checkUpdate]);
    return { status: status, reloadPage: reloadPage, checkUpdate: checkUpdate };
};
