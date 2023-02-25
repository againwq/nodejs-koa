/*全局捕获错误*/
const catchError = async function(ctx, next){
    try {
        await next()
    } catch (error) {
        console.error(error)
        ctx.body = {
            success: false,
            status_code: 500,
            data:{
                msg: '服务器内部错误！！！'
            }
        }
    }
}
export{
    catchError
}