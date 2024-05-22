const request = require('request');
const fs = require('fs')
const accounts = require('./accounts')



async function handle_profile_download(username, count) {
    let image;
    let caption;
    const uri = `https://www.instagram.com/api/v1/feed/user/${username}/username/?count=${count}`
    console.log(uri)
    const meme_image = `./irupload/memes/meme${String(Math.random() * 10000000).split('.')[0]}.jpeg`
    await fetch(uri, {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "dpr": "1",
    'cookie': accounts[0]['cookie'],
    "sec-ch-prefers-color-scheme": "dark",
    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
    "sec-ch-ua-full-version-list": "\"Not_A Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"120.0.6099.225\", \"Google Chrome\";v=\"120.0.6099.225\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-model": "\"\"",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-ch-ua-platform-version": "\"15.0.0\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "viewport-width": "1680",
    "x-asbd-id": "129477",
    "x-csrftoken": accounts[0]['csrf'],
    "x-ig-app-id": "936619743392459",
    "x-ig-www-claim": "hmac.AR2k0XAV4fC1aQQoKqFqyw4IFylWZY3zMC0ljDY1sK4bveED",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://www.instagram.com/hardimages.v2/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
}).then(resp => resp.json()).then(res => {
    const randomizer = res['items'].length
    const items = res['items']
    const meme = items[parseInt(String(Math.random() * randomizer).split('.')[0])]
    caption = meme['caption']['text']
    image = meme['image_versions2']['candidates'][0]['url']

});
console.log('Process Currently sleeping...')
setTimeout(() => {
    
}, 1000)
    return {
        'meme': image,
        'path': meme_image,
        'caption': caption
    }
    
}

module.exports = handle_profile_download