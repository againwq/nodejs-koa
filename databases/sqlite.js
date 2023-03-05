import sqlite from 'better-sqlite3'
import sqlMap from './sqlMap.js';
const db = new sqlite('./sqlite/vue.db')
/*查询用户信息*/
const searchUser = function (account) {
    const stmt = db.prepare(sqlMap.get('searchUser'))
    return stmt.all(account)
}
//查询是否含有指定文件的md5
const compareFileMD5 = function(md5){
    const stmt = db.prepare(sqlMap.get('searchFileMD5'))
    return stmt.all(md5)
}

/*保存文件信息*/
const saveFileInfo = function (file) {
    const stmt = db.prepare(sqlMap.get('saveFileInfo'))
    stmt.run(file)
}
/*获取文件信息*/
const returnFilesInfo = function(username){
    const stmt = db.prepare(sqlMap.get('returnFilesInfo'))
    return stmt.all(username)
}
//删除文件
const removeFile = function(username, filename){
    const stmt = db.prepare(sqlMap.get('removeFile'))
    stmt.run(username, filename)
}
export {
    searchUser, saveFileInfo, returnFilesInfo, removeFile, compareFileMD5
}