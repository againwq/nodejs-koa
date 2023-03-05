import { dateOptimize, saveFileData, sequeStream } from '../utils/tools.js'
import { compareFileMD5 } from '../databases/sqlite.js'
import { Dirent, existsSync, createWriteStream, createReadStream, writeFile } from 'node:fs'
import { readdir, copyFile, mkdir, rm } from 'node:fs/promises'
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
    const checkPath = `${config.TMP_SAVE_FILE}/${username}${path}/${fileMD5}`
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
            console.log('ddddd')
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
/**
 * 
 * @param {*} ctx 
 * @param {*} next 
 */
const uploadChunk = async function (ctx, next) {
    let { username, md5, path, finish, total } = ctx.request.query
    const tmpDir = `${config.TMP_SAVE_FILE}/${username}${path}/${md5}`
    const aimFile = `${config.FILE_DEPOSIT_PATH}/${username}${path}/${md5}`

    if (parseInt(finish)) {
        total = parseInt(total)
        const filesName = (await readdir(tmpDir)).map(value => parseInt(value))
        //如果收到结束请求后没有缺少的chunk,就将tmpDir中的文件合并并移到用户指定目录，然后删除tmpDir
        if (total === filesName.length) {
            writeFile(`${aimFile}`, '', (err) => {
                if (err) console.log(err);
            })

            let aimStream = createWriteStream(`${aimFile}`)

            for (let i of [...Array(total).keys()]) {
                console.log(i)
                const sourceStream = createReadStream(`${tmpDir}/${i}`)
                await sequeStream(sourceStream, aimStream)
            }
            await rm(tmpDir, { recursive: true, force: true })

            ctx.body = { success: true, data: { merge: true } }

        } else {
            //如果有缺失的文件就查出缺失的chunk,然后要求前端重新发
            const compareArr = Array.from({ length: total }, (v, k) => k)
            const loseArr = compareArr.filter((value) => !filesName.includes(value))
            ctx.body = { success: true, data: { merge: false, lose: loseArr } }
        }

    } else {
        const chunks = ctx.request.files
        const chunkName = Object.keys(chunks)[0]
        if (!existsSync(tmpDir)) await mkdir(tmpDir, { recursive: true })
        const readStream = createReadStream(chunks[chunkName].filepath)

        writeFile(`${tmpDir}/${chunkName}`, '', async (err) => {
            if (err) console.log(err)
        })
        let writeStream = createWriteStream(`${tmpDir}/${chunkName}`)

        await sequeStream(readStream, writeStream)

        ctx.body = {
            success: true,
            data: {
                chunk: parseInt(chunkName)
            }
        }
    }

    await next()
}



export {
    verifyFileMD5, uploadChunk
}