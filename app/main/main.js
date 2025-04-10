const { app, BrowserWindow, ipcMain, screen, Tray, Menu, globalShortcut } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();
let mainWindow;
let overlayWindow;
let tray;
let currentShortcut = 'CommandOrControl+X';
let registeredShortcut = null;
let isQuitting = false;
const isDev = process.argv.includes('--debug');
const showDevTools = process.argv.includes('--devtools') || isDev;

// Fonction pour ouvrir les DevTools
function openDevTools(window) {
    try {
        window.webContents.openDevTools({
            mode: 'detach',
            activate: true
        });
    } catch (error) {
        console.error('Erreur lors de l\'ouverture des DevTools:', error);
    }
}

// Lors de la création de la fenêtre principale, charger la page d'authentification si nécessaire
async function createWindow() {
    // Créer la fenêtre du navigateur principal
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        frame: false,
        icon: path.join(__dirname, '../../assets/icons/256x256.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            partition: 'persist:main',
            cache: false
        }
    });

    // Vérifier si l'utilisateur est connecté
    const userStored = store.get('user');
    
    // Si l'utilisateur n'est pas connecté, charger la page d'authentification
    if (!userStored) {
        mainWindow.loadFile(path.join(__dirname, '../renderer/auth.html'));
        
        // Ouvrir les DevTools pour la page d'authentification
        if (showDevTools || process.argv.includes('--devtools')) {
            mainWindow.webContents.on('did-finish-load', () => {
                openDevTools(mainWindow);
            });
        }
    } else {
        // Sinon, charger la page principale
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
        
        // Ouvrir les DevTools pour la page principale
        if (showDevTools || process.argv.includes('--devtools')) {
            mainWindow.webContents.on('did-finish-load', () => {
                openDevTools(mainWindow);
            });
        }
    }

    // Gestion de la fermeture
    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow.hide();
            return false;
        }
    });
}

function createOverlayWindow() {
    const { width } = screen.getPrimaryDisplay().workAreaSize;
    
    overlayWindow = new BrowserWindow({
        width: 300,
        height: 400,
        x: width - 308,
        y: 8,
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        hasShadow: false,
        roundedCorners: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            partition: 'persist:overlay',
            cache: false
        }
    });

    overlayWindow.loadFile(path.join(__dirname, '../overlay/overlay.html'));
    overlayWindow.setBackgroundColor('#00000000');
    overlayWindow.setIgnoreMouseEvents(false);
    overlayWindow.hide();

    // Ouvrir les DevTools si demandé
    // if (showDevTools) {
    //     overlayWindow.webContents.on('did-finish-load', () => {
    //         openDevTools(overlayWindow);
    //     });
    // }
}

function createTray() {
    try {
        const iconPath = path.join(__dirname, '../../assets/icons/32x32.png');
        tray = new Tray(iconPath);
        
        const contextMenu = Menu.buildFromTemplate([
            { 
                label: 'Ouvrir',
                click: () => {
                    mainWindow.show();
                }
            },
            { 
                label: 'Quitter',
                click: () => {
                    isQuitting = true;
                    app.quit();
                }
            }
        ]);
        
        tray.setToolTip('Hubscord');
        tray.setContextMenu(contextMenu);
        
        tray.on('click', () => {
            mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
        });
    } catch (error) {
        console.error('Erreur lors de la création du tray:', error);
    }
}

// Gestion des raccourcis
function registerShortcut(shortcut) {
    try {
        if (registeredShortcut) {
            globalShortcut.unregister(registeredShortcut);
        }

        const success = globalShortcut.register(shortcut, () => {
            if (overlayWindow) {
                overlayWindow.isVisible() ? overlayWindow.hide() : overlayWindow.show();
            }
        });

        if (success) {
            registeredShortcut = shortcut;
            currentShortcut = shortcut;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du raccourci:', error);
        return false;
    }
}

// Gestionnaires d'événements IPC
ipcMain.on('window-control', (event, command) => {
    if (!mainWindow) return;

    switch (command) {
        case 'minimize':
            mainWindow.minimize();
            break;
        case 'maximize':
            mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
            break;
        case 'close':
            mainWindow.hide();
            break;
    }
});

ipcMain.on('toggle-overlay', () => {
    if (overlayWindow) {
        overlayWindow.isVisible() ? overlayWindow.hide() : overlayWindow.show();
    }
});

ipcMain.on('update-game', (event, gameData) => {
    if (overlayWindow) {
        overlayWindow.webContents.send('game-updated', gameData);
    }
});

ipcMain.on('update-shortcut', (event, newShortcut) => {
    if (!registerShortcut(newShortcut)) {
        registerShortcut(currentShortcut);
    }
});

// Initialisation de l'application
app.whenReady().then(() => {
    createWindow();
    createOverlayWindow();
    createTray();
    registerShortcut(currentShortcut);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
            createOverlayWindow();
        }
    });
});

// Nettoyage avant de quitter
app.on('will-quit', () => {
    isQuitting = true;
    if (registeredShortcut) {
        globalShortcut.unregister(registeredShortcut);
    }
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
}); 