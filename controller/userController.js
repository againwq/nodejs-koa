import { searchUser } from "../databases/sqlite.js";
import { createUserSpace } from '../utils/tools.js'
/**
 * 用户登录校验
 * @param {*} account
 * @param {*} password
 */
async function invaildUser(ctx, next){
    const {account, password} = ctx.request.body
    const res = searchUser(account)
    if(res.length === 0){
        ctx.body = JSON.stringify({
            success: false,
            data:{
                msg: '用户不存在'
            }
        })
    }else{
        if(res[0].password != password){
            ctx.body = JSON.stringify({
                success: false,
                data:{
                    msg: '密码错误'
                }
            })
        }else{
            await createUserSpace(res[0].name)
            ctx.body = JSON.stringify({
                success: true,
                data:{
                    msg: '登录成功',
                    user: res[0].name
                }
            })
        }
    }
    await next()
}

export{
    invaildUser
}