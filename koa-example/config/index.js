const config = {
    dev:{
        //启动端口
        port:3000,
         //数据库配置
        database:{
            DATABASE: 'nodesql',
            USERNAME: 'root',
            PASSWORD: 'root',
            PORT: '3306',
            HOST: 'localhost'
        }
    }
}

module.exports = config