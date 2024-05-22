const handle_download = require('./download');
const handle_profile_download = require('./download_from_profile');
const handle_upload = require('./upload');
const analyizePage = require('./algorithm')
const request = require('request');
const fs = require('fs')
const sqlite3 = require('sqlite3')


let path;
let caption;
let meme;
let source;
let type;
let hashtags = ['memes', 'dankmemes', 'funnymemes', 'memesdaily', 'edgymemes', 'offensivememes', 'memestagram', 'spicymemes', 'tiktokmemes', 'memesespañol', 'memesespañol', 'nichememes', 'dankmemesdaily', 'kpopmemes', 'bestmemes', 'spongebobmemes', 'darkmemes', 'wholesomememes', 'memestar', 'relatablememes', 'stolenmemes', 'instamemes', 'memesbrasil', 'memesquad', 'deepfriedmemes', 'minecraftmemes', 'gamingmemes', 'cancermemes', 'edgymemesforedgyteens', 'immortalmemes', 'funniestmemes', 'memesgraciosos', 'shitposting', 'offensivememes', 'shitpost', 'memestagram']
let accounts = ['hardimages.v2', 'friendlycatsclub', 'sadgirlsanrio', 'vvsleepy', 'hissingpee', 'uncrustable.memess', 'axlethekittykat', 'zspongeb0bb', 'realcont3nt', 'reallionaire_grindset', 'imfinereallylol', 'nutwholesome']
function randomAccount() {
    let cursor = parseInt(String(Math.random() * 3).split('.')[0])
    if (cursor == 2) {
        cursor = 1;
    }
    return cursor
}

async function downloadImage(url, destination) {
    request(url)
      .pipe(fs.createWriteStream(destination)).on('close', () => {
        console.log('Uploading a meme...')
        handle_upload(path, caption, 0, source, type);
        
    })

}

async function handle_memes(custom_caption, type, array, top) {
    if (type == 'HASHTAG') {
        type = 'hashtag'
        hashtags = array
        if (custom_caption) {
            caption = custom_caption
        }
        let hashtag = parseInt(String(Math.random() * hashtags.length).split('.')[0])
        console.log(`Downloading a meme from ${hashtags[hashtag]}...`)
        await handle_download(hashtags[hashtag]).then(resp => {
            console.log('Meme downloaded.')
            path = resp['path']
            caption = resp['caption']
            if (!caption.includes('#')) {
                caption = 'Follow for more crap \n\n\n\n #dankmemes #funnymemes #memesdaily #edgymemes #offensivememes #dailymemes #memestagram #spicymemes #animememes #tiktokmemes #memesespañol #memesespañol #nichememes #dankmemesdaily #kpopmemes #bestmemes #darkmemes #wholesomememes #memestar #relatablememes #stolenmemes #instamemes #memesrlife #memesbrasil #memesquad #likeforlikes #likeforfollow #like'
            }
            if (custom_caption) {
                caption = custom_caption
            }
            source = hashtag
            meme = resp['meme']
        })
    }   
    if (type == 'PROFILE') {
        type = 'profile'
        accounts = array
        
        let profile = parseInt(String(Math.random() * accounts.length).split('.')[0])
        console.log(`Downloading a meme from ${accounts[profile]}...`)
        await handle_profile_download(accounts[profile], 12).then(resp => {
            caption = resp['caption']
            if (custom_caption) {
                caption = custom_caption
            }
            path = resp['path']
            meme = resp['meme']
            source = profile
        })
    }
    if (type == 'ALGORITHM') {
        type = 'profile'
        await analyizePage(50, top, array).then(resp => {
            resp = resp[parseInt(String(Math.random() * resp.length).split('.')[0])]
            caption = resp['caption']
            if (custom_caption) {
                caption = custom_caption
            }
            path = resp['path']
            meme = resp['meme']
            source = resp['source']
        });
    }
    await downloadImage(meme, path);
    
}



module.exports = handle_memes