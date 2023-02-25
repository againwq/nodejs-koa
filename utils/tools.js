import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import config from '../config.js'
import { saveFileInfo } from '../databases/sqlite.js'

const dateOptimize = function () {
    let time = new Date()
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let day = time.getDate()
    return `${year}-${month}-${day}`
}

//创建用户文件夹
const createUserSpace = async function (username) {
    const userDir = `${config.FILE_DEPOSIT_PATH}/${username}/default`
    if (!existsSync(userDir)) {
        await mkdir(userDir, { recursive: true })
    }
}

const saveFileData = function(username, fileName, fileSize, fileType, md5, uploadDate, isCompleted=0, path='/default'){
    isCompleted = isCompleted || 0
    saveFileInfo({ username, fileName, fileSize, fileType, md5, uploadDate, isCompleted, path })
}

export {
    dateOptimize, createUserSpace, saveFileData
}