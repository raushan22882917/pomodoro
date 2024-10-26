// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 580,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: true,
    },
  });

  // Load the Next.js app
  mainWindow.loadURL('http://localhost:3000'); // Assumes your Next.js app runs on localhost:3000
}

app.whenReady().then(createWindow);

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
