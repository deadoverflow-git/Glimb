const handle_memes = require('./index')
const accounts = require('./accounts')
const login = require('./instagram/utils/client/login')
const request = require('./instagram/utils/request/fetch_wrap');

async function upload_post(type, array, caption, top)  {
    await handle_memes(caption, type, array, top)
}

module.exports = upload_post