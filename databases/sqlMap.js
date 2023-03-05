const sqlMap = new Map()
sqlMap.set('searchUser', 'SELECT email, name, password FROM user WHERE email = ?') //搜索用户，用作登录验证
sqlMap.set('searchFileMD5', `SELECT md5, path FROM file WHERE md5 = ? and isCompleted = 1`)  //获取文件md5
sqlMap.set('saveFileInfo', `INSERT INTO file (username, fileName, fileSize, fileType, md5, uploadDate, isCompleted, path) 
                            VALUES (@username, @fileName, @fileSize, @fileType, @md5, @uploadDate, @isCompleted, @path)`) //保存文件信息
sqlMap.set('returnFilesInfo', `SELECT filename, filesize, type, upload_date FROM file
                            WHERE username = ?`) //返回指定用户所拥有的文件
sqlMap.set('removeFile', `DELETE FROM file where username = ? and filename = ?`)  //移除文件信息
export default sqlMap
