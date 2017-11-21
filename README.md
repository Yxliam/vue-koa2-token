### vue-koa2-token
### 基于vue的 做了token验证

### 前端部分（对axios设置Authorization）
```
import axios from 'axios'
import store from '../store'
import router from '../router'

//设置全局axios默认值
axios.defaults.timeout = 6000; //6000的超时验证
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

//创建一个axios实例
const instance = axios.create();
instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

axios.interceptors.request.use = instance.interceptors.request.use;

//request拦截器
instance.interceptors.request.use(
    config => {
        //每次发送请求之前检测都vuex存有token,那么都要放在请求头发送给服务器
        if(store.state.token){
            config.headers.Authorization = `token ${store.state.token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
//respone拦截器
instance.interceptors.response.use(
    response => {
        return response;
    },
    error => { //默认除了2XX之外的都是错误的，就会走这里
        if(error.response){
            switch(error.response.status){
                case 401:
                    store.dispatch('UserLogout'); //可能是token过期，清除它
                    router.replace({ //跳转到登录页面
                        path: 'login',
                        query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
                    });
            }
        }
        return Promise.reject(error.response);
    }
);

export default instance;
 然后在路由文件中
 //注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
  //获取store里面的token
  let token = store.state.token;
  //判断要去的路由有没有requiresAuth
  if(to.meta.requiresAuth){

    if(token){
      next();
    }else{
      next({
        path: '/login',
        query: { redirect: to.fullPath }  // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由
      });
    }

  }else{
    next();//如果无需token,那么随它去吧
  }
});
```

### 后端(node) 我们封装了一个中间件 在需要验证token的路由，加上这个中间件
```

 router.get('/dosh',checkToken,User.dosh)

const jwt = require('jsonwebtoken');

1、使用jsonwebtoken 创建token
const jwt = require('jsonwebtoken');

//登录时：核对用户名和密码成功后，应用将用户的id（图中的user_id）作为JWT Payload的一个属性
module.exports = function(user_id){
    const token = jwt.sign({
        user_id: user_id
    }, 'sinner77', {
        expiresIn: '3600s' //过期时间设置为60妙。那么decode这个token的时候得到的过期时间为 : 创建token的时间 +　设置的值
    });
    return token;
};
2、对于前端的请求，校验接口
//检查token是否过期
module.exports = async ( ctx, next ) => {
    if(ctx.request.header['authorization']){
        let token = ctx.request.header['authorization'].split(' ')[1];
        //解码token
        let decoded = jwt.decode(token, 'sinner77');
        //console.log(decoded);的输出 ：{ user_id: '123123123', iat: 1494405235, exp: 1494405235 }
        if(token && decoded.exp <= new Date()/1000){
            ctx.status = 401;
            ctx.body = {
                message: 'token过期'
            };
        }else{
            //如果权限没问题，那么交个下一个控制器处理
            return next();
        }
    }else{
        ctx.status = 401;
        ctx.body = {
            message: '没有token'
        }
    }
};
```


