import { Dirent } from 'node:fs'
const dir = new Dirent('./router.js')
console.log(dir.isDirectory())