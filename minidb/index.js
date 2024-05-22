const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('mini.db')



function set(key, value) {
    db.run('INSERT INTO mini (key, value) VALUES (?, ?)', [key, value])
}
function get_bones(key) {
    return new Promise((resolve, reject) => {
    db.all('SELECT value FROM mini WHERE key = ?', [key], (err, rows) => {
        if (rows.length == []) {
            resolve(undefined)
        }
        else {
            resolve(rows[0]['value']);
        }
    })})
}
function initilize() {
    db.run('CREATE TABLE IF NOT EXISTS mini(key TEXT, value TEXT)')
    db.run('INSERT INTO mini (key, value) VALUES (?, ?)', ['test', 'test'])
}
async function get(key) {
    let data = await get_bones(key);
    console.log(data)
    return data;
}

module.exports = {
    set, get, initilize
}