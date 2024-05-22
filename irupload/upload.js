const fs = require('fs')
const size = require('image-size')
const sqlite3 = require('sqlite3')
const accounts = require('./accounts')

const db = new sqlite3.Database('posts.db')

db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT,
            caption TEXT,
            source TEXT,
            type TEXT
        )
`)





async function handle_upload(path, caption, account, source, type) {
  console.log(`Currently using: ${accounts[account]['username']}`)
  console.log(path)
  let image = fs.readFileSync(path)
  const {width, height} = size(image)
  let upload_id = `170569${String(Math.random() * 10000000).split('.')[0]}`
  await fetch(`https://i.instagram.com/rupload_igphoto/fb_uploader_${upload_id}`, {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "image/jpeg",
      "offset": "0",
      "cookie": accounts[0]['cookie'], 
      "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-asbd-id": "129477",
      "x-entity-length": String(image.byteLength),
      "x-entity-name": `fb_uploader_${upload_id}`,
      "x-entity-type": "image/jpeg",
      "x-ig-app-id": "936619743392459",
      "x-instagram-ajax": "1010909070",
      "x-instagram-rupload-params": `{\"media_type\":1,\"upload_id\":\"${upload_id}\",\"upload_media_height\":${width},\"upload_media_width\":${height}}`
    },
    "referrer": "https://www.instagram.com/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": image,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }).then(resp => resp.json()).then(res => {
    console.log(`Upload completed. Debug: ${res}`)
    console.log('Configuring a post...')
  });
  console.log(caption)
  if (!caption.includes('#')) {
    caption = 'Follow for more \n\n\n\n\n#pinterestaesthetic #facebookmemes #facebookmeme #memesthatkeepmealive #facebookmemetemplate #facebookmemesaretherapy #facebookmemesformilfs #facebookmemesupremacy #badlyeditedfacebookmemes #badlyeditedmemes #fbmeme #fbmemes #fbmemetemplate #fbmemesformentallyillbitches #fbmemesaretherapy #fbmemesdaily #fbmemepage #relatable #relatablememes #facebooktextmemes #facebooktextpost #textmemes #explorepage #explorepage✨ #reactionmemes #shitpost #shitposter #dumbmemes #nichememes'
  }
  await fetch("https://www.instagram.com/api/v1/media/configure/", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/x-www-form-urlencoded",
    "cookie": accounts[0]['cookie'],
    "dpr": "1",
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
    "x-ig-www-claim": "hmac.AR3LRdScd7PgVhJzQhuCQLsD51dMfLAeBa5Kb6x5k9EnIL83",
    "x-instagram-ajax": "1010909070",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://www.instagram.com/accounts/onetap/?next=%2F",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": `archive_only=false&caption=${caption}&clips_share_preview_to_feed=1&disable_comments=0&disable_oa_reuse=false&igtv_share_preview_to_feed=1&is_meta_only_post=0&is_unified_video=1&like_and_view_counts_disabled=0&source_type=library&upload_id=${upload_id}&video_subtitles_enabled=0`,
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
}).then(resp => resp.json()).then(res => {
  console.log('Post configured.')
//   console.log('Adding comment...')
//   fetch(`https://www.instagram.com/api/v1/web/comments/${id}/add/`, {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9",
//     "content-type": "application/x-www-form-urlencoded",
//     "dpr": "1",
//     "sec-ch-prefers-color-scheme": "dark",
//     'cookie': 'ig_did=6A256895-F144-4908-AFB6-21D32CDF209F; ig_nrcb=1; datr=Ln1_ZZfLq0d5hAT52nWkH-j3; mid=Zaac_wALAAEgncUdcM7jFiJJF1Qv; shbid="11766\\05463940796815\\0541737246693:01f70629d63d52172d352be6bb2b94ad68de576e8115bb2b21c1625f7186cecc1bd784fc"; shbts="1705710693\\05463940796815\\0541737246693:01f778fd6672e9a97150f45ebc4044822b444d7f33f7a77602a6ca57da36af5b66e38770"; csrftoken=xuLpbxXVsTFDIdSrYovcturQeQRqUslN; ds_user_id=64063238615; sessionid=64063238615%3ArnNjaXvWG3BeyE%3A20%3AAYdxjxwpJ86H8-pAdoPCYbubDvtNZk5hqaJk91ue7A; rur="LDC\\05464063238615\\0541737301194:01f7689e000804ea78b6d0450d8daf5d4c4030e0216df41fc34c5f6a1c2409592404d9e7"',
//     "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
//     "sec-ch-ua-full-version-list": "\"Not_A Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"120.0.6099.225\", \"Google Chrome\";v=\"120.0.6099.225\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-model": "\"\"",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-ch-ua-platform-version": "\"15.0.0\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "viewport-width": "1680",
//     "x-asbd-id": "129477",
//     "x-csrftoken": "xuLpbxXVsTFDIdSrYovcturQeQRqUslN",
//     "x-ig-app-id": "936619743392459",
//     "x-ig-www-claim": "hmac.AR2k0XAV4fC1aQQoKqFqyw4IFylWZY3zMC0ljDY1sK4bvWwT",
//     "x-instagram-ajax": "1010927278",
//     "x-requested-with": "XMLHttpRequest"
//   },
//   "referrer": "https://www.instagram.com/p/C2VDmhhtjKv/",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": `comment_text=follow for more! \n\n\n\n#memes #dankmemes #funnymemes #memesdaily #edgymemes #offensivememes #dailymemes #fortnitememes #memestagram #spicymemes #btsmemes #animememes #tiktokmemes #memesespañol #memesespañol #nichememes #dankmemesdaily #kpopmemes #bestmemes #spongebobmemes #darkmemes #wholesomememes #memestar #relatablememes #stolenmemes #instamemes #memesrlife #pubgmemes #memesbrasil #memesquad`,
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// })
// console.log('Comment added.')
console.log('\n\n\nDone.')
});

}

module.exports = handle_upload
