import { app, BrowserWindow, ipcMain, Menu, nativeImage, shell, Tray } from 'electron';
const path = require('path');

const APP_ICON_PATH = path.join(app.getAppPath(), 'assets/icon.ico');
const APP_ICON = nativeImage.createFromPath(APP_ICON_PATH);

let mainWindow_ = null;
let tray_ = null;

if (app.requestSingleInstanceLock() === false) {
    app.quit();
}

app.setAppUserModelId('moe.pypy.vrcx');

// for better performance to offscreen rendering
app.disableHardwareAcceleration();

ipcMain.on('vrcx', function (event, ...args) {
    console.log('ipcMain.on(vrcx)', args);
    event.reply('vrcx', ...args);
});

ipcMain.handle('vrcx', function (event, ...args) {
    console.log('ipcMain.handle(vrcx)', args);
    return args;
});

function saveMainWindow() {
    // var [x, y] = mainWindow_.getPosition();
    // var [width, height] = mainWindow_.getSize();
}

function activateMainWindow() {
    if (mainWindow_ !== null) {
        if (mainWindow_.isMinimized() === true) {
            mainWindow_.restore();
        }
        mainWindow_.show();
        mainWindow_.focus();
    }
}

function handleCloseMainWindow(event) {
    if (tray_ === null || app.isForceQuit === true) {
        return;
    }
    event.preventDefault();
    mainWindow_.hide();
}

function handleNavigation(event, target) {
    console.log('handleNavigation', arguments);
    shell.openExternal(target);
    event.preventDefault();
}

function handleDownload(event) {
    console.log('handleDownload', arguments);
    event.preventDefault();
}

function interceptWebRequest(webRequest) {
    webRequest.onBeforeSendHeaders(
        {
            urls: [
                '*://api.vrchat.cloud/*'
            ]
        },
        function (details, callback) {
            var { requestHeaders } = details;
            requestHeaders['Cache-Control'] = 'no-cache';
            callback({
                cancel: false,
                requestHeaders
            });
        }
    );
    webRequest.onHeadersReceived(
        {
            urls: [
                '*://api.vrchat.cloud/*'
            ]
        },
        function (details, callback) {
            var { responseHeaders } = details;
            if ('set-cookie' in responseHeaders) {
                var headers = responseHeaders['set-cookie'];
                for (var i = headers.length - 1; i >= 0; --i) {
                    var cookie = headers[i].replace(/; SameSite=(Strict|Lax|None)/ig, '');
                    headers[i] = cookie + '; SameSite=None';
                }
            }
            responseHeaders['access-control-allow-origin'] = ['*'];
            callback({
                cancel: false,
                responseHeaders
            });
        }
    );
}

function createMainWindow() {
    mainWindow_ = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 320,
        minHeight: 240,
        fullscreenable: false,
        title: 'VRCX',
        icon: APP_ICON,
        // frame: false,
        titleBarStyle: (process.platform === 'darwin') ? 'hiddenInset' : 'default',
        webPreferences: {
            nodeIntegration: true,
            defaultEncoding: 'utf-8',
            spellcheck: false
        }
    });

    if (process.platform === 'darwin') {
        app.on('before-quit', function () {
            app.isForceQuit = true;
        });
    }

    mainWindow_.on('close', handleCloseMainWindow);
    mainWindow_.on('resize', saveMainWindow);
    mainWindow_.on('move', saveMainWindow);

    var webContents = mainWindow_.webContents;
    webContents.openDevTools();
    webContents.userAgent = webContents.userAgent.replace(/(vrcx|electron)\/.+? /ig, '');
    webContents.on('did-finish-load', function () {
        webContents.setZoomFactor(1);
        webContents.setZoomLevel(0);
        webContents.send('vrcx', 'did-finish-load');
    });

    webContents.on('new-window', handleNavigation);
    webContents.on('will-navigate', handleNavigation);

    var session = webContents.session;
    interceptWebRequest(session.webRequest);
    session.on('will-download', handleDownload);
    // session.cookies.flushStore();
    session.cookies.set({
        url: 'https://api.vrchat.cloud/',
        name: 'auth',
        value: ''
    });

    mainWindow_.loadFile('assets/index.html');
}

function createTray() {
    var menu = Menu.buildFromTemplate([
        {
            label: 'Open',
            click() {
                activateMainWindow();
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Quit VRCX',
            click() {
                app.isForceQuit = true;
                app.quit();

                setTimeout(function () {
                    process.exit();
                }, 5000);
            }
        }
    ]);
    tray_ = new Tray(APP_ICON);
    tray_.setToolTip('VRCX');
    tray_.setContextMenu(menu);
    tray_.on('double-click', activateMainWindow);
}

app.on('second-instance', activateMainWindow);

app.on('activate', activateMainWindow);

app.on('will-quit', function () {
    if (tray_ !== null) {
        tray_.destroy();
    }
});

app.whenReady().then(function () {
    createMainWindow();
    createTray();
});
