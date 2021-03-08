import server from 'axios';
import qs from 'qs';

let baseUrl = "";
if (process.env.NODE_ENV === "development") {
    baseUrl = "http://localhost:9300/";
} else {
    baseUrl = "https://m.efeng.mobi/";
}


/** 封装接口请求处理
 必要参数：url
 page：当前页面对象
 needToken: 是否需要登录，默认否；
 data: 请求参数
 header: 头
 method： 默认GET
 */
const request = function (options) {
    return new Promise((resolve, reject) => {
        const currentPage = options.page;
        if (!options || !options.url) {
            reject({code:9999, msg:"缺少参数"});
        }

        //账号信息
        var s = localStorage.getItem("qzr_ms_account_info");
        var account = {};
        try {
            account = JSON.parse(s);
        }catch (e) {}


        if (!options.data) {options.data = {}}
        if (!options.header) {options.header = {}}

        options.method = !options.method ? 'get' : options.method.toLowerCase();

        if (options.needToken) {
            if (account.token) {
                options.header.Authorization = account.token;
                options.data.token = account.token;

            } else {
                reject({code:9999, msg:"请先登录"});
            }
        }

        let data =  {
            "account.id": account ? account.id : 0, scene:1,
            ...options.data
        };

        if (!data.scene) {data.scene = 1}

        if (options.method === "post") {
            if (!options.header["Content-Type"]) {
                options.header["Content-Type"] = "application/json;charset=UTF-8";
            }
            server.post(options.url, data, {
                baseURL:options.baseUrl || baseUrl,
                headers: options.header,
            }).then((res) => {
                _requestDoneBlock(res, resolve, reject);
            }, res => {
                _requestDoneBlock(res, resolve, reject);
            });
        } else {
            server.request({
                baseURL:options.baseUrl || baseUrl,
                url: options.url,
                method: options.method,
                params: data,
            }).then((res) => {
                _requestDoneBlock(res, resolve, reject);
            }, res => {
                _requestDoneBlock(res, resolve, reject);
            });
        }
    })
};

const upload = function (options) {
    return new Promise((resolve, reject) => {
        if (!options || !options.url) {
            reject({code:9999, msg:"缺少必要参数"});
        }

        if (!options.data) {
            reject({code:9999, msg:"缺少必要参数"});
        }

        server.post(options.url, options.data, {
            baseURL:options.baseUrl || baseUrl,
            headers: {"Content-Type": "multipart/form-data"},
        }).then((res) => {
            _requestDoneBlock(res, resolve, reject);
        }, res => {
            _requestDoneBlock(res, resolve, reject);
        });
    })
};

const _jumpLogin = function() {
    let nowStamp =  (new Date()).getTime(); //毫秒
    let lastJumpStr = localStorage.getItem("lastJumpLoginInfo");
    let isOkToJump = true;
    if (lastJumpStr && lastJumpStr.length > 0) {
        let jump = JSON.parse(lastJumpStr);
        if (jump.lastTimeStamp > 0) {
            if (nowStamp - jump.lastTimeStamp < 1000) {
                isOkToJump =false;
            }
        }
    }

    if (isOkToJump) {
        localStorage.setItem("lastJumpLoginInfo", JSON.stringify({lastTimeStamp: nowStamp}));
        window.open(window.location.origin + "/" + window.location.pathname + "#/login")
    }
};

const _requestDoneBlock = function (res, resolve, reject) {
    if (res && res.status === 200) {
        if (!res || !res.data) {
            reject({code:1000});
        }

        let data = res.data;
        if (res.data.code === 0) {
            resolve(data);
        } else if (data.code === 1104) {
            reject({code:9999, msg:"登录失效，请登录~"});

            //打开登录页面
            _jumpLogin()
        } else if (data.code === 9990 || data.code === 9999) {
            reject({code:9999, msg:data.msg});
        } else {
            reject({code:1000});
        }
    } else {
        let data = {code:1000};
        if (res && res.response && res.response.data) {
            data = res.response.data;
        }

        if (data.code === 1104) {
            reject({code:9999, msg:"登录失效，请登录~"});
            //打开登录页面
            _jumpLogin()
        } else {
            reject({code:1000, msg:data.msg});
        }
    }
};

export default {
    request:request,
    upload:upload
};
