const { contextBridge, ipcRenderer } = require('electron');

// Expose les API sécurisées au renderer
contextBridge.exposeInMainWorld('electronAPI', {
    // Contrôles de fenêtre
    minimizeWindow: () => ipcRenderer.send('window-control', 'minimize'),
    maximizeWindow: () => ipcRenderer.send('window-control', 'maximize'),
    closeWindow: () => ipcRenderer.send('window-control', 'close'),
    
    // Gestion de l'overlay
    toggleOverlay: () => ipcRenderer.send('toggle-overlay'),
    updateGame: (gameData) => ipcRenderer.send('update-game', gameData),
    
    // Gestion des raccourcis
    updateShortcut: (shortcut) => ipcRenderer.send('update-shortcut', shortcut),
    
    // Écouteurs d'événements
    onGameUpdated: (callback) => ipcRenderer.on('game-updated', callback),
    onOverlayToggled: (callback) => ipcRenderer.on('overlay-toggled', callback)
}); 