const accounts = require('./accounts')
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('posts.db')


async function analyizePage(count, top, array) {
    const pre_added = array
    const username = pre_added[parseInt(String(Math.random() * pre_added.length).split('.')[0])]
    console.log(`Using ${username}...`)
    let uri = `https://www.instagram.com/api/v1/feed/user/${username}/username/?count=${count}`
    let counter;
    let top_posts = []
    db.all(`SELECT * FROM mutations`, (err, resp) => {
        if (resp == undefined || resp == []) {
            
        }
        else {
            if (resp.length == 0) {

            }
            else {
                uri = `https://www.instagram.com/api/v1/feed/user/${resp[0]['next_source']}/username/?count=${count}`
            }
        }
    })
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
        const posts = res['items']
        const simplified = []
        for (var i = 0; i < posts.length; i++) {
            simplified.push({
                'id': posts[i]['pk'],
                'likes': posts[i]['like_count'],
                'meme': posts[i]['image_versions2']['candidates'][0]['url'],
                'caption': posts[i]['caption']['text'],
                'hashtags': [],
                'path': `./irupload/memes/meme${String(Math.random() * 10000000).split('.')[0]}.jpeg`,
                'source': username
            })
        }
        for (var i = 0; i < simplified.length; i++) {
            counter = 0
            for (var j = 0; j < simplified.length; j++) {
                if (counter > top) {
                    break;
                }
                else {
                    if (simplified[i]['likes'] < simplified[j]['likes']){
                        counter += 1;
                    }
                }
            }
            if (counter <= top) {
                top_posts.push(simplified[i])
            }
        }
        for (var i = 0; i < top_posts.length; i++) {
            console.log(top_posts[i])
        }
      })
      return top_posts
}

module.exports = analyizePage