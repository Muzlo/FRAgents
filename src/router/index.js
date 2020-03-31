import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const commonRoutes = [
    {
        path: '/login',
        name: 'login',
        meta: { title: '登录' },
        component: () => import('../components/Login.vue'),
    },
    {
        path: '/404',
        name: '404',
        meta: { title: '404' },
        component: () => import('../components/404.vue'),
    },
    { path: '/', redirect: '/home' },
    
]

// 本地所有的页面 需要配合后台返回的数据生成页面
export const asyncRoutes = {
    home: {
        path: 'home',
        name: 'home',
        meta: { title: '主页' },
        component: () => import('../views/Home.vue'),
    },
    /////////////////消息管理
    pushMsg: {
        path: 'pushMsg',
        name: 'pushMsg',
        meta: { title: '推送消息' },
        component: () => import('../views/pushMessage/pushMsg.vue'),
    },
    acceptMsg: {
        path: 'acceptMsg',
        name: 'acceptMsg',
        meta: { title: '查收消息' },
        component: () => import('../views/pushMessage/acceptMsg.vue'),
    },
    ///////////////我的代理商
    agentsJkRoyaltySet: {
        path: 'agentsJkRoyaltySet',
        name: 'agentsJkRoyaltySet',
        meta: { title: '代理商接口提成设定' },
        component: () => import('../views/myAgents/agentsJkRoyaltySet.vue'),
    },
    agentsWxRoyaltySet: {
        path: 'agentsWxRoyaltySet',
        name: 'agentsWxRoyaltySet',
        meta: { title: '代理商微信提成设定' },
        component: () => import('../views/myAgents/agentsWxRoyaltySet.vue'),
    },
    agentsManage: {
        path: 'agentsManage',
        name: 'agentsManage',
        meta: { title: '代理商管理' },
        component: () => import('../views/myAgents/agentsManage.vue'),
    },
    agentsQuery: {
        path: 'agentsQuery',
        name: 'agentsQuery',
        meta: { title: '代理商查询' },
        component: () => import('../views/myAgents/agentsQuery.vue'),
    },
    ////////////////我的钱包
    myAccount: {
        path: 'myAccount',
        name: 'myAccount',
        meta: { title: '代理商查询' },
        component: () => import('../views/myMoneybag/myAccount.vue'),
    },
    agentCashWithdrawalApplication: {
        path: 'agentCashWithdrawalApplication',
        name: 'agentCashWithdrawalApplication',
        meta: { title: '代理商提现申请' },
        component: () => import('../views/myMoneybag/agentCashWithdrawalApplication.vue'),
    },
    myCashWithdrawalApplication: {
        path: 'myCashWithdrawalApplication',
        name: 'myCashWithdrawalApplication',
        meta: { title: '我的提现申请' },
        component: () => import('../views/myMoneybag/myCashWithdrawalApplication.vue'),
    },
    WxRechargeQuery: {
        path: 'WxRechargeQuery',
        name: 'WxRechargeQuery',
        meta: { title: '微信充值查询' },
        component: () => import('../views/myMoneybag/WxRechargeQuery.vue'),
    },
    JkRechargeQuery: {
        path: 'JkRechargeQuery',
        name: 'JkRechargeQuery',
        meta: { title: '接口充值查询' },
        component: () => import('../views/myMoneybag/JkRechargeQuery.vue'),
    },
    transferRecord: {
        path: 'transferRecord',
        name: 'transferRecord',
        meta: { title: '转账记录' },
        component: () => import('../views/myMoneybag/transferRecord.vue'),
    },
    WxReconciliation: {
        path: 'WxReconciliation',
        name: 'WxReconciliation',
        meta: { title: '微信对账' },
        component: () => import('../views/myMoneybag/WxReconciliation.vue'),
    },
    JkReconciliation: {
        path: 'JkReconciliation',
        name: 'JkReconciliation',
        meta: { title: '接口对账' },
        component: () => import('../views/myMoneybag/JkReconciliation.vue'),
    },

    ////////////////用户管理与权限
    powerManage: {
        path: 'powerManage',
        name: 'powerManage',
        meta: { title: '权限管理' },
        component: () => import('../views/userPower/powerManage.vue'),
    },
    userManage: {
        path: 'userManage',
        name: 'userManage',
        meta: { title: '用户管理' },
        component: () => import('../views/userPower/userManage.vue'),
    },
    userPassword: {
        path: 'userPassword',
        name: 'userPassword',
        meta: { title: '密码修改' },
        component: () => import('../views/userPower/userPassword.vue'),
    },
    //////我的卡
    allCard: {
        path: 'allCard',
        name: 'allCard',
        meta: { title: '全部卡' },
        component: () => import('../views/myCard/allCard.vue'),
    },
    distributionAgentCard: {
        path: 'distributionAgentCard',
        name: 'distributionAgentCard',
        meta: { title: '分配代理商卡' },
        component: () => import('../views/myCard/distributionAgentCard.vue'),
    },
    recoveryAgentCard: {
        path: 'recoveryAgentCard',
        name: 'recoveryAgentCard',
        meta: { title: '回收代理商卡' },
        component: () => import('../views/myCard/recoveryAgentCard.vue'),
    },
    cardChange: {
        path: 'cardChange',
        name: 'cardChange',
        meta: { title: '卡号更换' },
        component: () => import('../views/myCard/cardChange.vue'),
    },
    


}

const createRouter = () => new Router({
    routes: commonRoutes,
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router