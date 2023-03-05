import sqlite from 'better-sqlite3'
const db = new sqlite('./sqlite/vue.db')

const searchUser = function(){
    const stmt = db.prepare(`DELETE FROM file`)
    return stmt.run()
}

console.log(searchUser())