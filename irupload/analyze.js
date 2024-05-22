const sqlite3 = require('sqlite3')
const accounts = require('./accounts')

const db = new sqlite3.Database('posts.db')
const target = 1;

let counter;
let top_posts = []
let top = 0
let source;

db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT,
            caption TEXT,
            source TEXT,
            type TEXT
        )
`)

db.run(`
            CREATE TABLE IF NOT EXISTS mutations (
                next_source TEXT,
                caption TEXT,
                hit_count INTEGER
            )
        
`)


async function analyze() {
    const username = accounts[target]['username'].split('@')[1]
    console.log(`Researching ${username}`)
    const uri = `https://www.instagram.com/api/v1/feed/user/${username}/username/?count=50`
    console.log(uri)
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
                'path': `./memes/meme${String(Math.random() * 10000000).split('.')[0]}.jpeg`,
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
        
        top_id = String(top_posts[0]['id'])
        db.all(`SELECT source FROM posts WHERE id = ${top_id}`, (err, rows) => {
            try {
                console.log(`Mutation added: ${top_posts[0]}`)
                db.run(`INSERT INTO mutations (next_source, caption, hit_count) VALUES (?, ?)`, [rows[0]['source'], top_posts[0]['caption'], 1])
            }
            catch (e) {
                console.log('Failed')
            }
        })

      });

}
   
analyze().then(resp => console.log(resp))
