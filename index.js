import Koa from 'koa'
import staticServer from 'koa-static'
import mount from 'koa-mount'
import cors from '@koa/cors'
import router from './router.js'
import { koaBody } from 'koa-body'
import { catchError } from './middle/catchError.js'


const app = new Koa()
app.use(catchError)
//跨域
app.use(cors())
//解析request
app.use(koaBody({
    multipart:true,
}))

//静态服务器
app.use(mount('/static/FilesDeposit', staticServer('FilesDeposit', { defer: true })))
app.use(mount('/static/ProjectDeposit',staticServer('ProjectDeposit', { defer: true })))
//api请求路由
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000, '127.0.0.1', () => console.log('server is listening on http://localhost:3000'))