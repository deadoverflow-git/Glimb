const {set, get, initilize} = require('./minidb')
const { app, BrowserWindow, ipcMain } = require('electron');
const login = require('./irupload/instagram/utils/client/login')
const accounts = require('./irupload/accounts')
const request = require('./irupload/instagram/utils/request/fetch_wrap');
const prefix = 'views'
const upload_post = require('./irupload/main')


function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        // icon: path.join(__dirname, 'icon/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // for simplicity in this example
            enableRemoteModule: true // if using Electron 9 or earlier
        },
        autoHideMenuBar: true
    });

    mainWindow.loadFile(`./${prefix}/license_register.html`);
    initilize();
    
    get('license').then(resp => {
        if (resp != undefined) {
            mainWindow.loadFile(`./${prefix}/instagram_login.html`);
        }
        get('accounts').then(resp => {
            if (resp) {
                accounts[0] = JSON.parse(resp);
                mainWindow.loadFile(`./${prefix}/dashboard.html`);
            }
            
        })
    })
    
    ipcMain.on('licence', (event, args) => {
        set('license', args)
        mainWindow.loadFile(`./${prefix}/instagram_login.html`);
    })
    ipcMain.on('login', async (event, args) => {
        var data = args.split('|')
        username = data[0]
        password = data[1]
        data = await login(username, password);
        if (data.authenticated) {
            set('username', username);
            set('password', password);
            accounts[0]['username'] = username
            accounts[0]['cookie'] = request.cookies
            accounts[0]['csrf'] = request.cookies.split('csrftoken=')[1].split(';')[0];
            cookies_new = accounts[0]['cookie'].split('csrftoken=null; ')
            accounts[0]['cookie'] = cookies_new[0] + cookies_new[1]
            set('accounts', JSON.stringify(accounts[0]));
            mainWindow.loadFile(`./${prefix}/dashboard.html`);
        }
    })
    ipcMain.on('navigate', (event, args) => {
        mainWindow.loadFile(`./${prefix}/${args}.html`);
    })
    ipcMain.on('upload', (event, args) => {
        const json = JSON.parse(args);
        if (json.type == 'HASHTAG') {
            var temp = json['hashtags']
            tags = []
            temp = temp.split(' ')
            for (var i = 0; i < temp.length; i++) {
                tags.push(temp[i].substr(1));
            }
            for (var i = 0; i < json.postCount; i++) {
                upload_post('HASHTAG', tags, json.caption);
            }

        }
        if (json.type == 'PROFILE') {
            var temp = json['profiles']
            tags = []
            temp = temp.split(' ')
            for (var i = 0; i < temp.length; i++) {
                tags.push(temp[i].substr(1));
            }
            for (var i = 0; i < json.postCount; i++) {
                upload_post('HASHTAG', tags, json.caption);
            }
        }
        if (json.type == 'ALGORITHM') {
            var temp = json['profiles']
            tags = []
            temp = temp.split(' ')
            for (var i = 0; i < temp.length; i++) {
                tags.push(temp[i].substr(1));
            }
            for (var i = 0; i < json.postCount; i++) {
                upload_post('ALGORITHM', tags, json.caption);
            }
        }
    })

}

app.whenReady().then(createWindow);
