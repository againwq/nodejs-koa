import { dateOptimize, saveFileData } from '../utils/tools.js'
import { compareFileMD5 } from '../databases/sqlite.js'
import { Dirent, existsSync } from 'node:fs'
import { readdir, copyFile } from 'node:fs/promises'
import config from '../config.js'
import path from 'node:path'
/**
 * 
 * @param {string} fileMD5 文件md5值
 * @param {string} username  用户名
 * @param {string} path 用户存储路径
 * @returns
 */
const checkFileComplete = async function (fileMD5, username, path) {
    const checkPath = `${config.FILE_DEPOSIT_PATH}/${username}${path}/${fileMD5}`
    const dirent = new Dirent(checkPath)
    //如果指定路径是一个文件夹，则代表当前文件已经上传了一部分分片
    if (existsSync(checkPath) && dirent.isDirectory()) {
        return true
    } else {
        return false
    }
}

/**
 * 上传文件前的预检接口
 * @param {string} username 用户名 
 * @param {string} name 文件名
 * @param {Number} size 文件大小
 * @param {string} type 文件类型
 * @param {string} MD5 文件md5值
 * @param {string} dirPath 用户存储路径 默认'/default'
 */
const verifyFileMD5 = async function (ctx, next) {
    let { username, name, size, type, MD5, dirPath } = ctx.request.query
    const isUpload = await checkFileComplete(MD5, username, dirPath)
    if (isUpload) { //如果是正在上传的文件，就返回已经上传的切片数量
        const currentChunks = await readdir(`${config.FILE_DEPOSIT_PATH}/${username}${path}/${MD5}`)
        ctx.body = {
            success: true,
            data: {
                isNew: false,
                chunkCount: currentChunks,
                isUpload
            }
        }
    } else {
        const res = compareFileMD5(MD5)
        let isCompleted = 0
        //如果没找到相同的md5值，则代表这是个新文件
        if (!res.length) {
            ctx.body = {
                success: true,
                data: {
                    isNew: true
                }
            }
        } else {
            //如果找到了相同的md5值，则直接秒传
            let { md5, path } = res[0]
            path = `${config.FILE_DEPOSIT_PATH}/${username}${path}/${md5}`
            const aimPath = `${config.FILE_DEPOSIT_PATH}$/${username}${dirPath}/${MD5}`
            if (aimPath !== path) await copyFile(path, aimPath)
            ctx.body = {
                success: true,
                data: {
                    isNew: false,
                    quickFinish: true
                }
            }
            isCompleted++
        }
        //保存文件信息至数据库
        saveFileData(username, name, size, type, MD5, dateOptimize(), isCompleted, dirPath)
    }

    await next()

}


export {
    verifyFileMD5
}