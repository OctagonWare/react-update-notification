"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdateCheck = void 0;
var react_1 = require("react");
var types_1 = require("./types");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
var reloadPage = function () { return window.location.reload(true); };
var currentVersion = window.__APP_VERSION__;
var useUpdateCheck = function (_a) {
    var interval = _a.interval, type = _a.type, ignoreServerCache = _a.ignoreServerCache;
    var _b = (0, react_1.useState)(types_1.UpdateStatus.checking), status = _b[0], setStatus = _b[1];
    var checkUpdate = (0, react_1.useCallback)(function () {
        if (typeof currentVersion === 'undefined') {
            setStatus(types_1.UpdateStatus.current);
            return;
        }
        setStatus(types_1.UpdateStatus.checking);
        var requestStr = "/".concat(window.__APP_VERSION_FILE__);
        if (ignoreServerCache) {
            requestStr += "?v=".concat(Date.now());
        }
        fetch(requestStr)
            .then(function (res) { return res.json(); })
            .then(function (data) {
            if (data.version === currentVersion) {
                setStatus(types_1.UpdateStatus.current);
            }
            else {
                setStatus(types_1.UpdateStatus.available);
            }
        })
            .catch(function () {
            setStatus(types_1.UpdateStatus.current);
        });
    }, [ignoreServerCache]);
    (0, react_1.useEffect)(function () {
        if (type !== 'manual') {
            checkUpdate();
        }
    }, [checkUpdate, type]);
    (0, react_1.useEffect)(function () {
        if (status !== types_1.UpdateStatus.current) {
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
exports.useUpdateCheck = useUpdateCheck;
