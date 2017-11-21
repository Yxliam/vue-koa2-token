//初始化时用sessionStore.getItem('token'),这样子刷新页面就无需重新登录

//state 访问状态对象 spa中所说的共享值
//vuex 提供了commit的方法修改state的状态
const state = {
    token: window.sessionStorage.getItem('token'),
};

export default state;