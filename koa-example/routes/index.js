//checkToken作为中间件存在
const checkToken = require('../token/checkToken.js');

const router = require('koa-router')(),
    User = require('../controllers/user.js');

    router.get('/',async (ctx,next)=>{
       await ctx.render('index')
    })
    router.get('/login',async (ctx,next)=>{
       await ctx.render('login')
    })
    router.post('/register_new',User.registerPosts)
    //登录
    router.post('/login_new',User.loginPost)
    router.get('/dosh',checkToken,async (ctx,next)=>{
       ctx.body = {
         code :2,
         msg:'err'
       }
    })

module.exports = router
