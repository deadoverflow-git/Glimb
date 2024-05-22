const request = require('request');
const accounts = require('./accounts')
const fs = require('fs')



async function handle_download(hashtag) {
    let section;
    let item = 2
    let caption;
    let meme_image = `./irupload/memes/meme${String(Math.random() * 10000000).split('.')[0]}.jpeg`
    let meme;
    await fetch(`https://www.instagram.com/api/v1/tags/web_info/?tag_name=${hashtag}`, {
        method: 'GET',
        'headers': {
            'cookie': accounts[0]['cookie'],
            'X-Csrftoken': accounts[0]['csrf'],
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'X-Ig-Www-Claim': 'hmac.AR3LRdScd7PgVhJzQhuCQLsD51dMfLAeBa5Kb6x5k9EnIHoK',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site':'same-origin',
            'X-Ig-App-Id': '936619743392459',
            'X-Asbd-Id': '129477'
        }
    }).then(resp => resp.json()).then(res => {
        console.log(res)
        let randomizer = res['data']['top']['sections'].length
        section = parseInt(String(Math.random() * randomizer).split('.')[0])
        item = parseInt(String(Math.random() * 3).split('.')[0])
        if (section == 0) {
            section += 1;
        }
        // if (res['data']['top']['sections'][section]['layout_content']['medias'][item]['media']['video_versions']) {
        //     return handle_download(hashtag);
        // }
        // else {
            meme = res['data']['top']['sections'][section]['layout_content']['medias'][item]['media']['image_versions2']['candidates'][0]['url']
            caption = res['data']['top']['sections'][section]['layout_content']['medias'][item]['media']['caption']['text']
        // }
        
        
    })
    console.log('Process Currently sleeping...')
    setTimeout(() => {
        
    }, 1000)
    return {
        'meme': meme,
        'path': meme_image,
        'caption': caption
    }
}

module.exports = handle_download