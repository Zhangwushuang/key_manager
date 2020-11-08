/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';
const electron = require('electron');
const app = electron.app;// 控制应用生命周期的模块。
const BrowserWindow = electron.BrowserWindow;// 创建原生浏览器窗口的模块

//隐藏菜单栏
electron.Menu.setApplicationMenu(null);

//保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，window 会被自动地关闭
var mainWindow = null;

// 当所有窗口被关闭了，退出。
app.on('window-all-closed', function() {
  // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
  // 应用会保持活动状态
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.on('ready', function() {

    const win_cf = {
        //width: 1200, //打开调试工具时
        width: 400,
        height: 600,
        useContentSize:true,
        resizable: false,
        autoHideMenuBar:true,
        webPreferences: { nodeIntegration: true}
    };
    
    mainWindow = new BrowserWindow(win_cf);
    mainWindow.loadURL('file://' + __dirname + '/html/choose_key.html');
    //mainWindow.openDevTools();// 打开开发工具

    // 当 window 被关闭，这个事件会被发出
    mainWindow.on('closed', function(){
        mainWindow = null;
    }); 
});