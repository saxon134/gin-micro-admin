import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});

const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    //获取登录信息
    try {
        let str = localStorage.getItem("qzr_ms_account_info");
        let accountInfo = JSON.parse(str);
        if (!accountInfo || !accountInfo.token || !accountInfo.id) {
            if (to.path === '/login' || to.path === "/403" || to.path === "/register") {
                next();
            } else {
                next('/login');
                alert("登录状态失效，请先登录");
            }
        } else if (to.path !== "/") {
            let exist = false;
            if (to.path === '/login' || to.path === "/404" || to.path === "/register") {
                exist = true
            } else if (accountInfo.menuAry && accountInfo.menuAry.length > 0) {
                for(let i = 0; i < accountInfo.menuAry.length; i ++) {
                    if (('/' + accountInfo.menuAry[i].path === to.path) || ('/' + accountInfo.menuAry[i].index === to.path)) {
                        exist = true; break;
                    }

                    if (accountInfo.menuAry[i].subs && accountInfo.menuAry[i].subs.length > 0) {
                        for(let j = 0; j < accountInfo.menuAry[i].subs.length; j ++) {
                            if (('/' + accountInfo.menuAry[i].subs[j].path === to.path) || ('/' + accountInfo.menuAry[i].subs[j].index === to.path)) {
                                exist = true; break;
                            }
                        }

                        if (exist === true) {break}
                    }
                }
            }

            if (exist) {next()}
        } else {
            next()
        }
    } catch (err) {
        if (to.path !== '/403' && to.path !== "/login" && to.path !== "/register") {
            alert("登录状态失效，请先登录");
            next('/login');
        } else {
            next();
        }
    }
});


new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');

/**************** 挂载通用方法 ****************/
import utils_ from './utils/utils'
Vue.prototype.utils = utils_;

import common_ from './utils/app.common'
Vue.prototype.common = common_;

import models_ from './utils/models'
Vue.prototype.models = models_;

import request from './utils/request'
Vue.prototype.request = request.request;
Vue.prototype.upload = request.upload;


//获取账号信息
Vue.prototype.getAccountInfo = function () {
    let s = localStorage.getItem("qzr_ms_account_info");
    try {
        if (s) {
            let v = JSON.parse(s);
            if (!v.current) {v.current = {}}
            if (!v.companyAry) {v.companyAry = []}
            return v;
        }
    } catch (err) {
        return {}
    }
    return {};
};

Vue.prototype.getCurrCompany = function () {
    let s = localStorage.getItem("qzr_ms_account_info");
    try {
        if (s) {
            let v = JSON.parse(s);
            if (v) {
                if (!v.current) {v.current = {}}
                if (!v.companyAry) {v.companyAry = []}

                if (v.current.id > 0) {
                    return v.current;
                } else if (v.companyAry.length > 0) {
                    return v.companyAry[0]
                }
            }
            return {}
        }
    } catch (err) {
        return {}
    }
    return {};
};

Vue.prototype.getCategory = () => {
    return request.request({
        url: "coserve/category.ary", data: {status:2},
    })
};