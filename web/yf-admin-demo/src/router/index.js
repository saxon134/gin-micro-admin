import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

let routes = [{
    path: '/',
    component: resolve => require(['../components/common/Home.vue'], resolve),
    meta: { title: '' },
    children:[
        {
            path: '/index',
            component: resolve => require(['../components/page/empty.vue'], resolve),
            changeOrigin:true,
            meta: { title: '企丈人' }
        },

        /******** 账户 ********/
        {
            path: '/account',
            component: resolve => require(['../components/page/account.vue'], resolve),
            changeOrigin:true,
            meta: { title: '账户列表' }
        },{
            path: '/media',
            component: resolve => require(['../components/page/media.vue'], resolve),
            changeOrigin:true,
            meta: { title: '应用设置' }
        },{
            path: '/company',
            component: resolve => require(['../components/page/company.vue'], resolve),
            changeOrigin:true,
            meta: { title: '公司企业' }
        },


        /******** 用户 ********/
        {
            path: '/user',
            component: resolve => require(['../components/page/user.vue'], resolve),
            changeOrigin:true,
            meta: { title: '用户列表' }
        },{
            path: '/feedback',
            component: resolve => require(['../components/page/feedback.vue'], resolve),
            changeOrigin:true,
            meta: { title: '意见反馈' }
        },

        /******** 内容 ********/
        {
            path: '/category',
            component: resolve => require(['../components/page/category.vue'], resolve),
            changeOrigin:true,
            meta: { title: '服务分类' }
        }, {
            path: '/serve',
            component: resolve => require(['../components/page/serve.vue'], resolve),
            changeOrigin:true,
            meta: { title: '服务项目' }
        },  {
            path: '/activity',
            component: resolve => require(['../components/page/activity.vue'], resolve),
            changeOrigin:true,
            meta: { title: '优惠活动' }
        }, {
            path: '/order',
            component: resolve => require(['../components/page/order.vue'], resolve),
            changeOrigin:true,
            meta: { title: '服务订单' }
        }, {
            path: '/commission',
            component: resolve => require(['../components/page/commission.vue'], resolve),
            changeOrigin:true,
            meta: { title: '佣金结算' }
        },{
            path: '/recharge',
            component: resolve => require(['../components/page/recharge.vue'], resolve),
            changeOrigin:true,
            meta: { title: '充值结算' }
        },

        /******** 设置 ********/
        {
            path: '/banner',
            component: resolve => require(['../components/page/banner.vue'], resolve),
            changeOrigin:true,
            meta: { title: '小程序banner' }
        },

        /******** 知识库 ********/
        {
            path: '/content',
            component: resolve => require(['../components/page/content.vue'], resolve),
            changeOrigin:true,
            meta: { title: '财税知识' }
        },{
            path: '/document',
            component: resolve => require(['../components/page/document.vue'], resolve),
            changeOrigin:true,
            meta: { title: '共享文档' }
        },{
            path: '/workflow',
            component: resolve => require(['../components/page/workflow.vue'], resolve),
            changeOrigin:true,
            meta: { title: '标准流程' }
        },
    ]
}, {
    path: '/login',
    component: () => import('../components/page/login.vue')
}, {
    path: '/404',
    component: resolve => require(['../components/page/404.vue'], resolve),
}, {
    path: '/403',
    component: resolve => require(['../components/page/403.vue'], resolve),
}, {
    path: '*',
    redirect: '/404'
}];


export default new Router({
    mode:'hash',
    routes: routes
})