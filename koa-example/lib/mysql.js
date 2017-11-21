var mysql = require('mysql');
var config = require('../config/index.js')
var md5 = require('md5')

//定义pool池
var pool  = mysql.createPool({
    host     : config.dev.database.HOST,
    user     : config.dev.database.USERNAME,
    password : config.dev.database.PASSWORD,
    database : config.dev.database.DATABASE
  });

let query = function( sql, values ) {
    
      return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
          if (err) {
            resolve( err )
          } else {
            connection.query(sql, values, ( err, rows) => {
              if ( err ) {
                reject( err )
              } else {
                resolve( rows )
              }
              //回收pool
              connection.release()
            })
          }
        })
      })
    
    }
let dologin = function(name){
    let _sql = `select * from user_token where username = "${name}"`;
    return query(_sql)
}
let doRegister = function(value){
  let _sql = "insert into user_token(username,password,token) values(?,?,?);"
  return query(_sql,value)
}

let updateUserToken = function(value){
  let _sql = "update user_token set token = ? where id = ?;"
  return query(_sql,value)
}





module.exports = {
    dologin,
    doRegister,
    updateUserToken
}