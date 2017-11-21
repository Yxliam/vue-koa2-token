const  Model = require('../lib/mysql.js');
const createToken = require('../token/createToken.js');
class UserController{
    //用户登录 
    static async loginPost(ctx){
        //es6 解构
        //这里解构需要和 ctx.request.body 的对象属性相同
        const { username,password } = ctx.request.body;
      
       
        let asult = await Model.dologin(username)
            .then(result=>{
              var res = JSON.parse(JSON.stringify(result))
              return res;
            })
            let token = createToken(username);
      await Model.updateUserToken([token,asult[0]['id']])
      .then(res=>{
        if(res){   
            console.log( token );
            console.log(asult[0]['id']);
            ctx.jsonReturn({
                code:1,
                data:{
                    token:token,
                    username:username
                },
                msg:'登录成功啊1212'
            })
           
          }else{
            ctx.jsonReturn({
                code:2,
                msg:'登录失败'
            }) 
          }
           
        }).catch(err=>{
            console.log(err);
            ctx.jsonReturn({
                code:2,
                msg:err
            })
      })
    
                  
    }
    static async registerPosts(ctx){
        const { username,password,checkPassword } = ctx.request.body;
        const token = createToken(username)
        await Model.doRegister([username,password,token])
            .then(result=>{
                console.log( result );
               if(result){
                ctx.jsonReturn({
                    code:1,
                    msg:'ok'
                })
               }else{
                ctx.jsonReturn({
                    code:2,
                    msg:'err'
                }) 
               }
            }).catch(err=>{
                ctx.jsonReturn({
                    code:2,
                    msg:err
                })
            })
    }
}

module.exports = UserController;