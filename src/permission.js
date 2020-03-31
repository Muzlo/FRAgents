import router from './router'
import store from './store'
import createRoutes from '@/utils/createRoutes'
import { getDocumentTitle, resetTokenAndClearUser } from './utils'
// 是否有菜单数据
let hasMenus = false
router.beforeEach(async (to, from, next) => {
    document.title = getDocumentTitle(to.meta.title)
    if (localStorage.getItem('token')) {
            if (to.path === '/login') {
                next({ path: '/' })
            } else if (hasMenus) {
                next()
            } else {
                try {
                    // 这里可以用 await 配合请求后台数据来生成路由
                    // const data = await axios.get('xxx')
                    // const routes = createRoutes(data)
                    const arr= [
                        {
                            name: 'home', // 要跳转的路由名称 不是路径
                            text: '主页', // 文本内容
                            
                        },
                        {
                            text: '我的代理商',
                            children: [
                                {
                                    name: 'agentsManage',
                                    text: '代理商管理',
                                    
                                },
                                {
                                    name: 'agentsWxRoyaltySet',
                                    text: '代理商微信提成设定',
                                    
                                },
                                {
                                    name: 'agentsJkRoyaltySet',
                                    text: '代理商接口提成设定',
                                    
                                },
                                {
                                    name: 'agentsQuery',
                                    text: '代理商查询',
                                    
                                },
                            ],
                        },
                        {
                            text: '我的钱包',
                            children:[
                                {
                                    name: 'myAccount',
                                    text: '代理商查询',
                                    
                                },
                                {
                                    name: 'agentCashWithdrawalApplication',
                                    text: '代理商提现申请',
                                    
                                },
                                {
                                    name: 'myCashWithdrawalApplication',
                                    text: '我的提现申请',
                                    
                                },
                                {
                                    name: 'WxRechargeQuery',
                                    text: '微信充值查询',
                                    
                                },
                                {
                                    name: 'JkRechargeQuery',
                                    text: '接口充值查询',
                                    
                                },
                                {
                                    name: 'transferRecord',
                                    text: '转账记录',
                                    
                                },
                                {
                                    name: 'WxReconciliation',
                                    text: '微信对账',
                                    
                                },
                                {
                                    name: 'JkReconciliation',
                                    text: '接口对账',
                                    hidden:true
                                },
                            ]
                        },
                        {
                            text: '用户与权限',
                            children:[
                                {
                                    name: 'powerManage',
                                    text: '权限管理',
                                    
                                },
                                {
                                    name: 'userManage',
                                    text: '用户管理',
                                    
                                },
                                {
                                    name: 'userPassword',
                                    text: '密码修改',
                                },
                                // {
                                //     name: 'msg',
                                //     text: '通知消息',
                                // },
                            ]
                        },
                        {
                            text: '我的卡',
                            children:[
                                {
                                    name: 'allCard',
                                    text: '全部卡',
                                    
                                },
                                {
                                    name: 'distributionAgentCard',
                                    text: '分配代理商卡',
                                    
                                },
                                {
                                    name: 'recoveryAgentCard',
                                    text: '回收代理商卡',
                                },
                                {
                                    name: 'cardChange',
                                    text: '卡号更换',
                                },
                            ]
                        },
                        {
                            text: '消息管理',
                            children:[
                                {
                                    name: 'pushMsg',
                                    text: '推送消息',
                                },
                                {
                                    name: 'acceptMsg',
                                    text: '查收消息',
                                }
                            ]
                        }
                        
                    ];
                    
                    arr.forEach((item)=>{
                            switch (item.text){
                                case "主页":
                                    item.icon="el-icon-s-home"
                                    break;
                                case "我的代理商":
                                        item.icon="el-icon-user-solid"
                                        break;
                                case "我的钱包":
                                    item.icon="el-icon-s-goods"
                                    break;
                                case "用户与权限":
                                    item.icon="el-icon-coin"
                                    break;
                                case "我的卡":
                                    item.icon="el-icon-postcard"
                                    break;
                                case "消息管理":
                                    item.icon="el-icon-s-promotion"
                                    break;
                            }

                    })



                    store.commit("setMenus",arr)
    
                    const routes = createRoutes(arr)
                    // const routes = createRoutes(store.state.menuItems)
                    // 动态添加路由
                    router.addRoutes(routes)
                    hasMenus = true
                    next({ path: to.path || '/' })
                } catch (error) {
                    resetTokenAndClearUser()
                    next(`/login?redirect=${to.path}`)
                }
            }
        

    } else {
        hasMenus = false
        if (to.path === '/login') {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})

router.afterEach(() => {
})