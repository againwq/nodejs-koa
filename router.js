import Router from '@koa/router'
import { invaildUser } from './controller/userController.js'
import { verifyFileMD5, uploadChunk } from './controller/uploadController.js'

const router = new Router({
    prefix: '/api' //配置基础路径
})

router.post('/user/userInvaild', invaildUser)
router.post('/file/verifyFileMD5', verifyFileMD5)
//上传小文件
//router.post('/file/uploadMiniFile')
//断点续传大文件
router.post('/file/uploadChunk', uploadChunk)

export default router