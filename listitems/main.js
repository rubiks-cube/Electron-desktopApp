const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

process.env.NODE_ENV ='production';

let mainWindow;

app.on('ready', function(){
   mainWindow = new BrowserWindow({});

   mainWindow.loadURL(url.format({
      pathname: path.join(__dirname,'mainWindow.html'),
      protocol: 'file:',
      slashes: true
   }));
//quit all windows in app
mainWindow.on('close', function(){
app.quit();
});

 //build menu from template
   const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
   Menu.setApplicationMenu(mainMenu);
});


//Add item Window
function createAddWindow(){
    addWindow = new BrowserWindow({
     width:300,
    height:200,
    title: 'Add Item'});

    addWindow.loadURL(url.format({
       pathname: path.join(__dirname,'addWindow.html'),
       protocol: 'file:',
       slashes: true
    }));

    //garbage collection 
    addWindow.on('close',function(){
       addWindow = null;
    });
}


//catch item add
ipcMain.on('item:add', function(e,item){
 
    mainWindow.webContents.send('item:add',item);
    addWindow.close();
})
//create menu template
const mainMenuTemplate = [
    {
      label: 'File',
      submenu: [
          {
              label: 'Add Item',
              click(){
                  createAddWindow();
              }
          },
          {
              label: 'Clear Items',
              click(){
                  mainWindow.webContents.send('item:clear');
              }
          },
          {
              label: 'Quit',
              accelerator: process.platform == 'darwin' ? 'Command+Q': 'Ctrl+Q',
              click(){
                  app.quit();
              }
          }
      ]
    }
];


//add DevToolsin Devmode
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'DevTools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I': 'Ctrl+I',
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role:'reload'
            }
        ]
    })
}