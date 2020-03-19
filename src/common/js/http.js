import axios from 'axios'
import { Loading } from 'element-ui';
var instance = axios.create({ 
    timeout: 1000 * 12
});
let loadingInstance;
// 已经为ajax请求设置了loading 请求前自动调用 请求完成自动结束
        // 添加请求拦截器
        instance.interceptors.request.use(config => {
            // 在发送请求之前做些什么
            loadingInstance=Loading.service({ fullscreen: true,text:"数据加载中" });
            //console.log(config)
            //根据config.url判断路径 是否需要加请求头
            // config.headers.common['token'] = localStorage.getItem('token');//可新增
            // config.headers.post['Content-Type2'] = 'application/x-www-form-urlencodedsssssssss';//可修改
            return config
        }, error => {
            // 对请求错误做些什么
            loadingInstance.close();
            return Promise.reject(error)
        })

        
        // 添加响应拦截器
        instance.interceptors.response.use(response => {
            loadingInstance.close();
            const res = response.data
            if(res.errCode==-1){
                //跳转到登录页
                MessageBox.alert('登录信息超时，请重新登录！', '登录超时', {
                    confirmButtonText: '确定',
                    callback: action => {
                       localStorage.removeItem('token');
                        router.replace({
                            path: '/login',
                        })
                    }
                });
            }
            return res
        }, error => {
            // 对响应错误做点什么
            loadingInstance.close();
            return Promise.reject(error)
        })

export default instance;