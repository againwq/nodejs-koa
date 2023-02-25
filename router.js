import Router from '@koa/router'
import { invaildUser } from './controller/userController.js'
import { verifyFileMD5 } from './controller/uploadController.js'


const router = new Router({
    prefix: '/api' //配置基础路径
})
/** 
* 用户登录校验接口
* @param account 账号（邮箱）
* @param password 密码
*/
router.post('/user/userInvaild', invaildUser)
router.post('/file/verifyFileMD5', verifyFileMD5)
//上传小文件
router.post('/file/uploadMiniFile')
//断点续传大文件
router.post('/file/uploadChunk', )

export default router