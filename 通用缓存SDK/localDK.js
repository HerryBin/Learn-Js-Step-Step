/**
 * Created by EX-XIANRONGBIN001 on 2017-08-10.
 */
window.Xhrfactory = function () {
    this.init.apply(this, arguments);
};
// 1.将SDK作用于定义在window上
// 优点：所有的内置方法，内置文件，内置函数都可以调用
// 缺点：污染到window的命名空间
window.Xhrfactory.prototype = {
    // 初始化方法
    init: function () {
        this.xhr = this.create();
    },
    // 创建方法
    create: function () {
        let xhr = null;
        if (window.XMLHttpRequest) {   // 判断标准浏览器
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXobject) {
            xhr = new ActiveXobject('Msml2.Xmlhttp');
        } else {
            // 老版本的IE
            xhr = new ActiveXobject('Microsoft.Xmlhttp');
        }
        return xhr;
    },
    // 状态方法
    readystate: function (callback) {
        this.xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                callback(this.responseText);
                console.log(this);
            }
        }
    },
    // 参数转换方法
    para: function (data) {
        let dataStr = '';
        // 利用原型判断对象
        if (data && Object.prototype.toString.call(data) === "[object Object]") {
            for (var item in data) {
                if (data.hasOwnProperty(item)) {
                    dataStr += item + '=' + data[item] + '&';
                }
            }
        }
        return dataStr;
    },
    // 发送请求的get方法
    get: function (url, data, callback) {
        this.readystate(callback);
        var dataStr = this.para(data);
        url = url + '?' + dataStr;
        this.xhr.open('get', url, true);
        this.xhr.send(null);

    }
};

// 后台程序的模板变量
let localStorageSign = 'off',
// 版本控制
    resourceVersion = 'cnbs_1.42';

// 拆解模块细化-网络交互功能：
// 1.create：创建xhr对象
// 2.readystate：回调函数处理
// 3.para：参数转换
// 4.get：请求发送
// 主方法
// 本地的Sdk主方法
window.mLocalSdk = {

    resourceJavascriptList: [
        {
            id: 'js_cdn1',
            url: '1.js',
            type: 'javascript'
        }, {
            id: 'js_cdn2',
            url: 'lib.js',
            type: 'javascript'
        }],

    needUpdate: (function () {
        return localStorage.getItem('resourceVersion') === resourceVersion;
    })(),


    isIE: (function () {
        let v = 3,
            div = document.createElement('div'),
            all = div.getElementsByTagName('i');
        while (
            div.innerHTML = '<!-- [if gt IE' + (++v) + ']><i></i><![endif] -->', !all[0]) {
            if (v > 11) {
                return false
            }
        }
        return v > 3 ? v : false;
    })(),
// 写入本地localStorage
    saveSdk: function () {

        try {
            localStorage.setItem('resourceVersion', resourceVersion);
        } catch (oException) {
            if (oException.name == 'QuotaExceededError') {
                localStorage.clear();
                localStorage.setItem('resourceVersion', resourceVersion);
            }
            alert('QuotaExceededError');
        }

        let _self = this,
            jsList = _self.resourceJavascriptList,
            promiseList = [],
            queryData = {version: resourceVersion};

        jsList.forEach(function (item) {
            var promise = new Promise(function (resolve, reject) {
                var xhr = new Xhrfactory();
                xhr.get(item.url, queryData, function (data) {
                    localStorage.setItem(item.id, data);
                    resolve(data);
                });
            });
            promiseList.push(promise);
        });

        return promiseList;
    },
//入口函数/启用函数
    startup: function () {

        // 满足一下条件
        var _self = this,
            jsList = _self.resourceJavascriptList,
            jsLen = jsList.length;
        if (localStorageSign === 'on' && !this.isIE && window.localStorage) {

            if (this.needUpdate === true) {
                //需要更新
                return (function () {
                    jsList.forEach(function (item) {
                        window.mDomUtils.addJavascriptByInline(item.id, item.url);
                    });
                })();

            } else {
                Promise.all(_self.saveSdk()).then(function () {
                    jsList.forEach(function (item) {
                        // 获取本地缓存列表 输入到html上
                        // 去读取本地文件
                        window.mDomUtils.addJavascriptByLink(item.id, item.url);
                    });
                });
            }
        } else {
            return (function () {
                jsList.forEach(function (item) {
                    // 获取本地缓存列表 输入到html上
                    // 去读取本地文件
                    window.mDomUtils.addJavascriptByLink(item.id, item.url);
                });
            })();
        }
    }

};
//工具方法：读本地缓存，将其写入也页面
window.mDomUtils = {

    // 内联方式添加javascript
    addJavascriptByInline: function (scriptId) {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.id = scriptId;
        var heads = document.getElementsByTagName('head');
        if (heads.length) {
            heads[0].appendChild(script);
        } else {
            document.documentElement.appendChild(script);
        }
        console.log('localStorage.getItem(scriptId)-----' + scriptId);
        script.innerHTML = localStorage.getItem(scriptId);
    },
// 外链方式添加javascript
    addJavascriptByLink: function (scriptId, url) {
        let script = document.createElement('script'),
            heads = document.getElementsByTagName('head');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', url);
        script.id = scriptId;

        if (heads.length) {
            heads[0].appendChild(script);
        } else {
            document.documentElement.appendChild(script);
        }
    },

// 外链方式添加css
    addCssByLink: function (url) {
        let doc = document,
            link = doc.createElement('link'),
            heads = doc.getElementsByTagName('head');

        link.setAttribute('type', 'text/css');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', url);

        if (heads.length) {
            heads[0].appendChild(link);
        } else {
            doc.documentElement.appendChild(link);
        }
    },

// 外链方式添加css

    addCssByLink: function (cssString) {
        let doc = document,
            link = doc.createElement('link'),
            heads = doc.getElementsByTagName('head');
        link.setAttribute('type', 'text/css');
        link.setAttribute('rel', 'stylesheet');

        if (link.stylesheet) {
            // IE支持
            link.stylesheet.cssText = cssString;
        } else {
            // w3c
            link.appendChild(doc.createTextNode(cssString));
        }


        if (heads.length) {
            heads[0].appendChild(link);
        } else {
            doc.documentElement.appendChild(link);
        }
    }
};